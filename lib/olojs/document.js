
const expression = require("./expression");

const DOM = require("./dom");






class Document {

    constructor (xml) {
        this.title = "";
        this.meta = new Map();
        this.template = "";
        
        const nodes = DOM.parse(xml);
        for (let node of nodes) {
            
            if (node instanceof DOM.Element && node.tag === "title") {
                this.title = String(node.children);
            }

            if (node instanceof DOM.Element && node.tag === "meta") {
                for (let [key, value] of node.attributes) {
                    this.meta.set(key, value);
                }
            }
            
            if (node instanceof DOM.Element && node.tag === "content") {
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
        const content = DOM.parse(this.template);        
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
    
    static get Comment () {
        return DOM.Comment;
    }
    
    static get Text () {
        return DOM.Text;
    }

    static get Element () {
        return DOM.Element;
    }
}

Document.decorators = new Map([]);


DOM.Node.prototype.render = async function (context) {}


DOM.Text.prototype.render = async function (context) {
    this.content = this.content.replace(/\{\{(.+?)\}\}/gm, (match, expr) => {
        try {
            let value = expression.eval(expr, context);
            return `<span class="expression">${value}</span>`;            
        } catch (error) {
            return renderError(error);
        }
    });
}


DOM.Element.prototype.render = async function (context) {
    try {
        await this.attributes.render(context);
    } catch (error) {
        this.toString = () => renderError(error);
    }
    
    await this.children.render(context);
}


DOM.Element.Attributes.prototype.render = async function (context) {
    for (let [attrName, attrValue] of this) {
        let matchExpr = attrValue.match(/^\{\{(.*)\}\}$/);
        if (matchExpr) {
            let expr = matchExpr[1];
            this.set(attrName, expression.eval(expr, context));
        }
    }
}




DOM.Node.List.prototype.decorate = function (decorators) {
    for (let i=0; i<this.length; i++) {
        if (this[i] instanceof DOM.Element) {
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

DOM.Node.List.prototype.render = async function (context) {
    for (let node of this) {
        try {
            await node.render(context);
        } catch (error) {
            node.toString = () => renderError(error);
        }
    }    
}





const Loader = DOM.Element.Loader = (load) => {
    return (element) => {
        const importElt = Object.create(element);
        importElt.attributes.sanitize(['href','name']);
        
        importElt.toString = () => "";
        
        importElt.render = async function (context) {
            await element.render(context);
            const targetDoc = await load(this.attributes.get("href"));
            const targetScope = {};
            await targetDoc.render(targetScope);
            context[this.attributes.get("name")] = targetScope;
        }
        
        return importElt;        
    }
}



function CustomElement (tag, templateElt) {
    return (element) => {
        const customElt = new DOM.Element(tag);
        customElt.attributes = templateElt.attributes.clone();
        customElt.children = templateElt.children.clone();
        
        const slots = {};
        for (let child of customElt.children) {
            if (child.tag === "slot" && child.attributes.has("name")) {
                slots[child.attributes.get("name")] = child;
            }
        }
        
        for (let child of element.children) {
            if (child instanceof DOM.Element && child.attributes.has("slot")) {
                let slotName = child.attributes.get("slot");
                if (slots[slotName]) slots[slotName].children.push(child);
            }
        }
        
        customElt.render = async function (context) {}
        
        customElt.toString = () => `Custom element: ${tag}`;
        return customElt;
    }
}



Document.decorators.set('set', (element) => {
    const setElt = Object.create(element);
    
    setElt.toString = () => "";
    
    setElt.render = async function (context) {
        await this.attributes.render(context);
        for (let [key, value] of this.attributes) {
            context[key] = value;
        }
    }
    
    return setElt;
});



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





module.exports = Document;
