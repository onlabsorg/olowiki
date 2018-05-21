
const himalaya = require("himalaya");


function parse (html) {
    const srcNodes = himalaya.parse(html);
    return new NodeList(...srcNodes);
}


class NodeList extends Array {

    constructor (...nodes) {
        super();

        for (let node of nodes) {
            switch (node.type) {

                case 'element':
                    this.push(new Element(node.tagName, node.attributes, node.children));
                    break;

                case 'text':
                    this.push(new TextNode(node.content));
                    break;

                case 'comment':
                    this.push(new CommentNode(node.content));
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


class ElementAttributes {

    constructor (attrList) {
        for (let attr of attrList) {
            this[attr.key] = attr.value;
        }
    }
    
    sanitize (allowedAttributes) {
        const attrNames = Object.getOwnPropertyNames(this); 
        for (let attrName of attrNames) {
            if (allowedAttributes.indexOf(attrName) === -1) {
                delete this[attrName];
            }
        }
    }

    toJSON () {
        const attrList = [];
        for (let name of Object.getOwnPropertyNames(this)) {
            attrList.push({key:name, value:this[name]});
        }
        return attrList;
    }
}


class Element extends Node {

    constructor (tagName, attrList, children) {
        super();
        this.tag = tagName;
        this.attributes = new ElementAttributes(attrList);
        this.children = new NodeList(children);
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



class TextNode extends Node {

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



class CommentNode extends Node {

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


exports.parse = parse;
exports.NodeList = NodeList;
exports.Node = Node;
exports.Element = Element;
exports.ElementAttributes = ElementAttributes;
exports.TextNode = TextNode;
exports.CommentNode = CommentNode;
