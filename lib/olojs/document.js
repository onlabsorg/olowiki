
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
        content.decorate(Document.Element.decorators, Document.Element.Attributes.decorators);
        await content.render(context);
        content.sanitize(Document.allowedTags)
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

    sanitize (allowedTags, deep=true) {
        const blackList = [];
        for (let node of this) {
            if (node instanceof Document.Element) {
                let blacklisted = true;
                for (let re of allowedTags) {
                    if (node.tag.match(re)) {
                        blacklisted = false;
                        break;
                    }
                }
                if (blacklisted) blackList.push(node);
                else if (deep) node.children.sanitize(allowedTags);
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

    toString () {
        return this.map(child => String(child)).join("");
    }
    
    toHTML () {
        return this.map(child => child.toHTML()).join("");
    }
    
    decorate (tagDecorators, attrDecorators) {
        
        for (let i=0; i<this.length; i++) {
            if (this[i] instanceof Document.Element) {
                
                for (let [attrName, attrValue] of this[i].attributes) {
                    for (let [re, decorator] of attrDecorators) {
                        let match = attrName.match(re);
                        if (match && typeof decorator === "function") {
                            let params = match.slice(1);
                            this[i] = decorator(this[i], ...params);
                            break;
                        }
                    }
                }                
                
                for (let [re, decorator] of tagDecorators) {
                    let match = this[i].tag.match(re);
                    if (match && typeof decorator === "function") {
                        let params = match.slice(1);
                        this[i] = decorator(this[i], ...params);
                        break;
                    }
                }
                
                this[i].children.decorate(tagDecorators, attrDecorators);                
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
    
    toHTML () {
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

    toHTML () {
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
    
    toString () {
        if (this.children.length === 0) {
            return `<${this.tag}${this.attributes} />`;
        } else {
            return `<${this.tag}${this.attributes}>${this.children}</${this.tag}>`;
        }
    }
    
    toHTML () {
        return `<${this.tag}${this.attributes}>${this.children.toHTML()}</${this.tag}>`;
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
            attrString += ` ${key}="${value}"`;
        }
        return attrString;
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



Document.Element.decorators = new Map();
Document.Element.Attributes.decorators = new Map();

Document.allowedTags = new Set([

    // headers
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',

    // lists
    'ul', 'ol', 'li', 'dl', 'dt', 'dd',

    // tables
    'table', 'thead', 'tbody', 'tfoot', 'caption', 'col', 'colgroup', 'tr', 'th', 'td',

    // misc block tags
    'p', 'blockquote', 'pre', 'div', 'br', 'hr', 
    
    // inline tags
    'b', 'i', 'strong', 'em', 'code', 'a', 'img', 'span',
    
]);

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



require("./plugins/set")(Document);
module.exports = Document;
