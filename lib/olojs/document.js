
const expression = require("./expression");
const Parser = require("htmlparser2").Parser;



class Document {

    constructor (xml) {
        this.title = "";
        this.meta = new Map();
        this.template = "";
        
        const nodes = Document.parse(xml);
        for (let node of nodes) {
            
            if (node instanceof Document.Element && node.tag === "title") {
                this.title = String(node.children);
            }

            if (node instanceof Document.Element && node.tag === "meta") {
                for (let [key, value] of node.attributes) {
                    this.meta.set(key, value);
                }
            }
            
            if (node instanceof Document.Element && node.tag === "content") {
                this.template = String(node.children).trim();
            }
        }
    }
    
    get author () {
        return this.meta.get("author");
    }
    
    set author (id) {
        this.meta.set("author", id);
    }
    
    get public () {
        return this.meta.get("authorization") === "public";
    }
    
    set public (value) {
        if (Boolean(value)) {
            this.meta.set("authorization", "public");
        } else {
            this.meta.delete("authorization");
        }
    }
    
    async render (context) {
        const content = Document.parse(this.template);        
        content.decorate(Document.decorators);
        await content.render(context);
        return content;
    }

    toString () {
        const metaTag = new Document.Element("meta");        
        for (let [key, value] of this.meta) {
            metaTag.attributes.set(key, value);
        }
        
        return documentTemplate
        .replace("{{title}}", this.title)
        .replace("{{meta-data}}", String(metaTag))
        .replace("{{template}}", this.template);
    }
    
    static parse (html) {
        const rootElt = new Document.Element("/");
        const openTags = [rootElt];
        const lastOpenTag = () => openTags[openTags.length - 1];
        
        const parserHandlers = {
            
            onopentagname (tagName) {
                const element = new Document.Element(tagName);
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
                const textNode = new Document.Text(text);
                lastOpenTag().children.push(textNode);
            },
            
            oncomment (content) {
                const commentNode = new Document.Comment(content);
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
}



Document.Node = class {
    async render (context) {}
}



Document.Node.List = class extends Array {
    
    constructor () {
        super();
    }
    
    clone () {
        const clone = new Document.Node.List();
        for (let node of this) {
            clone.push(node.clone());
        }
        return clone;
    }

    sanitize (allowedTags) {
        if (allowedTags === true) return;
        const blackList = [];
        for (let node of this) {
            if (node instanceof Document.Element && allowedTags.indexOf(node.tag) === -1) {
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
            if (recursive && node instanceof Document.Element) {
                let subMatch = node.children.find(testFn);
                match = match.concat(subMatch);
            }
        }
        return match;
    }

    toString (selfClosing=true) {
        return this.map(child => child.toString(selfClosing)).join("");
    }
    
    decorate (decorators) {
        for (let i=0; i<this.length; i++) {
            if (this[i] instanceof Document.Element) {
                let tag = this[i].tag;
                
                if (tag.substr(0,4) === "def:" && tag.length > 4) {
                    let newTag = this[i].tag.substr(4);
                    Document.decorators.set(newTag, CustomElement(newTag, this[i]));
                }
                
                else {
                    let decorator = decorators.get(tag);
                    if (typeof decorator === "function") {
                        this[i] = decorator(this[i]);
                    }
                    this[i].children.decorate(decorators);                
                }
            }
        }        
    }
    
    async render (context) {
        for (let node of this) {
            try {
                await node.render(context);
            } catch (error) {
                node.toString = () => renderError(error);
            }
        }    
    }
}



Document.Text = class extends Document.Node {

    constructor (content) {
        super();
        this.content = content;
    }
    
    clone () {
        return new Document.Text(this.content);
    }
    
    toString () {
        return this.content;
    }
    
    async render (context) {
        this.content = this.content.replace(/\{\{(.+?)\}\}/gm, (match, expr) => {
            try {
                let value = expression.eval(expr, context);
                return `<span class="expression">${value}</span>`;            
            } catch (error) {
                return renderError(error);
            }
        });        
    }
}



Document.Comment = class extends Document.Node {

    constructor (content) {
        super();
        this.content = content;
    }
    
    clone () {
        return new Document.Comment(this.content);
    }
    
    toString () {
        return `<!--${this.content}-->`;
    }
}



Document.Element = class extends Document.Node {

    constructor (tagName) {
        super();
        this.tag = tagName;
        this.attributes = new Document.Element.Attributes();
        this.children = new Document.Node.List();
    }
    
    clone () {
        const cloneElt = new Document.Element(this.tag);
        cloneElt.attributes = this.attributes.clone();
        cloneElt.children = this.children.clone();
        return cloneElt;
    }
    
    toString (selfClosing=true) {
        
        if (this.children.length === 0 && selfClosing) {
            return `<${this.tag} ${this.attributes} />`;
        } else {
            return `<${this.tag} ${this.attributes}>${this.children.toString(selfClosing)}</${this.tag}>`;
        }
    }
    
    async render (context) {
        try {
            await this.attributes.render(context);
        } catch (error) {
            this.toString = () => renderError(error);
        }
        
        await this.children.render(context);        
    }
}



Document.Element.Attributes = class extends Map {
    
    constructor () {
        super();
    }
    
    clone () {
        const clone = new Document.Element.Attributes();
        for (let [key, value] of this) {
            clone.set(key, value);
        }
        return clone;
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
    
    async render (context) {
        for (let [attrName, attrValue] of this) {
            let matchExpr = attrValue.match(/^\{\{(.*)\}\}$/);
            if (matchExpr) {
                let expr = matchExpr[1];
                this.set(attrName, expression.eval(expr, context));
            }
        }        
    }
}



function CustomElement (tag, templateElt) {
    return (element) => {
        const customElt = new Document.Element(tag);
        customElt.attributes = templateElt.attributes.clone();
        customElt.children = templateElt.children.clone();
        
        const slots = {};
        for (let child of customElt.children) {
            if (child.tag === "slot" && child.attributes.has("name")) {
                slots[child.attributes.get("name")] = child;
            }
        }
        
        for (let child of element.children) {
            if (child instanceof Document.Element && child.attributes.has("slot")) {
                let slotName = child.attributes.get("slot");
                if (slots[slotName]) slots[slotName].children.push(child);
            }
        }
        
        customElt.render = async function (context) {}
        
        customElt.toString = () => `Custom element: ${tag}`;
        return customElt;
    }
}



function renderError (error) {
    return `<span class="error">${error}</span>`;
}



const documentTemplate = `
<title>{{title}}</title>
{{meta-data}}
<content>
{{template}}
</content>
`;



Document.decorators = new Map([]);
require("./plugins/set")(Document);



module.exports = Document;
