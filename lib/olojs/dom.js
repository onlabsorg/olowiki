const Parser = require("htmlparser2").Parser;

const DOM = module.exports = {};



DOM.parse = function (html) {
    
    const rootElt = new DOM.Element("/");
    const openTags = [rootElt];
    const lastOpenTag = () => openTags[openTags.length - 1];
    
    const parserHandlers = {
        
        onopentagname (tagName) {
            const element = new DOM.Element(tagName);
            lastOpenTag().children.push(element);
            openTags.push(element);
        },
        
        onattribute (attrName, attrValue) {
            lastOpenTag().attributes.set(attrName, attrValue);
        },
        
        onclosetag (tagName) {
            if (lastOpenTag().tag !== tagName) return;
            const element = openTags.pop();
        },
        
        ontext (text) {
            const textNode = new DOM.Text(text);
            lastOpenTag().children.push(textNode);
        },
        
        oncomment (content) {
            const commentNode = new DOM.Comment(content);
            lastOpenTag().children.push(commentNode);            
        }
    };
    
    const parserOptions = {
        decodeEntities: true, 
        lowerCaseTags: false, 
        lowerCaseAttributeNames: false,
        recognizeSelfClosing: true,
        xmlMode: true
    };
    
    const parser = new Parser(parserHandlers, parserOptions);
    parser.parseChunk(html);
    parser.done();
    
    return rootElt.children;
}



DOM.Node = class {}




DOM.Text = class extends DOM.Node {

    constructor (content) {
        super();
        this.content = content;
    }
    
    toString () {
        return this.content;
    }
}



DOM.Comment = class extends DOM.Node {

    constructor (content) {
        super();
        this.content = content;
    }
    
    toString () {
        return `<!--${this.content}-->`;
    }
}



DOM.Element = class extends DOM.Node {

    constructor (tagName) {
        super();
        this.tag = tagName;
        this.attributes = new DOM.Element.Attributes();
        this.children = new DOM.Node.List();
    }
    
    toString () {
        
        if (this.children.length > 0) {
            return `<${this.tag} ${this.attributes}>${this.children}</${this.tag}>`
        } else {
            return `<${this.tag} ${this.attributes} />`
        }
    }
}



DOM.Element.Attributes = class extends Map {
    
    constructor () {
        super();
    }
    
    sanitize (allowedAttributes) {
        if (allowedAttributes === true) return;
        if (Array.isArray(allowedAttributes)) {
            for (let attrName of this.keys()) {
                if (allowedAttributes.indexOf(attrName) === -1) {
                    this.delete(attrName);
                }
            }
        }
        else {
            this.clear();
        }
    }

    toString () {
        var attrString = "";
        for (let [key, value] of this) {
            attrString += `${key}="${value}" `;
        }
        return attrString.trim();
    }
}



DOM.Node.List = class extends Array {
    
    constructor () {
        super();
    }
    
    clone () {
        const clone = new DOM.Node.List();
        for (let node of this) {
            clone.push(node.clone());
        }
        return clone;
    }

    sanitize (allowedTags) {
        if (allowedTags === true) return;
        const blackList = [];
        for (let node of this) {
            if (node instanceof DOM.Element && allowedTags.indexOf(node.tag) === -1) {
                blackList.push(node);
            }
        }
        for (let node of blackList) {
            let index = this.indexOf(node);
            if (index !== -1) this.splice(index, 1);
        }
    }
    
    find (testFn, recursive=true) {
        var match = [];
        for (let node of this) {
            if (testFn(node)) match.push(node);
            if (recursive && node instanceof DOM.Element) {
                let subMatch = node.children.find(testFn);
                match = match.concat(subMatch);
            }
        }
        return match;
    }

    toString () {
        return this.map(child => String(child)).join("");
    }
}
