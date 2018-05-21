
const himalaya = require("himalaya");


function parse (html) {
    const srcNodes = himalaya.parse(html);
    return new Nodes(...srcNodes);
}


class Nodes extends Array {

    constructor (...nodes) {
        super();

        for (let node of nodes) {
            switch (node.type) {

                case 'element':
                    this.push(new Element(node.tagName, node.attributes, node.children));
                    break;

                case 'text':
                    this.push(new Text(node.content));
                    break;

                case 'comment':
                    this.push(new Comment(node.content));
                    break;
            }
        }
    }

    sanitize (allowedTags) {
        const blackList = [];
        for (let node of this) {
            if (node instanceof Element && allowedTags.indexOf(node.tag) === -1) {
                blackList.push(node);
            }
        }
        for (let node of blackList) {
            let index = this.indexOf(node);
            if (index !== -1) this.splice(index, 1);
        }
    }
    
    findTags (...tagNames) {
        const elements = {};
        for (let name of tagNames) elements[name] = [];
        for (let node of this) {
            if (node instanceof Element) {
                if (elements[node.tag]) {
                    elements[node.tag].push(node);
                } else {
                    let subElements = node.children.findTags(...tagNames);
                    for (let name of tagNames) {
                        elements[name] = elements[name].concat(subElements[name]);
                    }
                }
            }
        }
        return elements;
    }

    toJSON () {
        return this.map(node => node.toJSON());
    }

    toString () {
        return himalaya.stringify(this.toJSON());
    }
}



class Node {

    toString () {
        himalaya.stringify(this.toJSON());
    }
}


class Attributes {

    constructor (attrList) {
        for (let attr of attrList) {
            this[attr.key] = attr.value;
        }
    }

    getNames () {
        return Object.getOwnPropertyNames(this);
    }

    sanitize (allowedAttributes) {
        const attrNames = this.getNames();
        for (let attrName of attrNames) {
            if (allowedAttributes.indexOf(attrName) === -1) {
                delete this[attrName];
            }
        }
    }

    toJSON () {
        const attrList = [];
        const names = this.getNames();
        for (let name of names) {
            attrList.push({key:name, value:this[name]});
        }
        return attrList;
    }
    
    toString () {
        const attrString = "";
        const names = this.getNames();
        for (let name of names) {
            attrString += `${name}="${this[name]}" `;
        }
        return attrString.trim();
    }
}


class Element extends Node {

    constructor (tagName, attrList, children) {
        super();
        this.tag = tagName;
        this.attributes = new Attributes(attrList);
        this.children = new Nodes(...children);
    }

    toJSON () {
        return {
            type: 'element',
            tagName: this.tag,
            attributes: this.attributes.toJSON(),
            children: this.children.toJSON()
        };
    }
}



class Text extends Node {

    constructor (content) {
        super();
        this.content = content;
    }

    toJSON () {
        return {
            type: 'text',
            content: this.content
        }
    }
}



class Comment extends Node {

    constructor (content) {
        super();
        this.content = content;
    }

    toJSON () {
        return {
            type: 'comment',
            content: this.content
        }
    }
}


module.exports = {parse, Nodes, Node, Element, Attributes, Text, Comment};
