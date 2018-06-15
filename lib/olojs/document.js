
const expression = require("./expression");

const himalaya = require("himalaya");


class Document {

    constructor (docData) {
        this.title = docData.title;
        this.author = docData.author;
        this.template = docData.template;
    }

    async renderTemplate (context) {
        const templateNodes = Document.parseHTML(this.template);
        templateNodes.sanitize(Object.keys(elementRegistry));
        await templateNodes.render(context);
        return String(templateNodes);
    }

    toJSON () {
        return {
            title: this.title,
            author: this.author,
            template: this.template
        }
    }

    toHTML () {
        return documentTemplate
        .replace("{{title}}", this.title)
        .replace("{{author}}", this.author)
        .replace("{{template}}", this.template);
    }

    static parseHTML (html) {
        const srcNodes = himalaya.parse(html);
        return new Element.Children(...srcNodes);
    }

    static parse (html) {
        const docData = {
            title: "",
            author: undefined,
            template: ""
        };

        const nodes = this.parseHTML(html);

        const titleElt = nodes.find(node => node.tag === 'title')[0];
        docData.title = titleElt ? String(titleElt.children) : "";

        const metaElts = nodes.find(node => node.tag === 'meta');
        for (let metaElt of metaElts) {
            if (metaElt.attributes.get('name') === "author") {
                docData.author = metaElt.attributes.get("content");
                break;
            }
        }

        const templateElt = nodes.find(node => node.tag === 'template' && node.attributes.get("id") === 'source')[0];
        docData.template = templateElt ? String(templateElt.children).trim() : "";

        return new Document(docData);
    }
    
    static registerTag (tagName, tagConfig) {
        tagName = tagName.toLowerCase();

        switch (tagConfig.type) {
            
            /*
              Tags which auto-close because they cannot be nested
              For example: <p>Outer<p>Inner is <p>Outer</p><p>Inner</p>
            */
            case 'closing':
                if (himalaya.parseDefaults.closingTags.indexOf(tagName) === -1) {
                    himalaya.parseDefaults.closingTags.push(tagName);
                }
                break;
                
            /*
              Tags which do not need the closing tag
              For example: <img> does not need </img>
            */
            case 'void':
                if (himalaya.parseDefaults.voidTags.indexOf(tagName) === -1) {
                    himalaya.parseDefaults.voidTags.push(tagName);
                }
                break;
                
            /*
              Tag which contain arbitary non-parsed content
              For example: <script> JavaScript should not be parsed
            */        
            case 'childless':
                if (himalaya.parseDefaults.childlessTags.indexOf(tagName) === -1) {
                    himalaya.parseDefaults.childlessTags.push(tagName);
                }
                break;
        }

        elementRegistry[tagName] = tagConfig;        
    }
}



const Node = Document.Node = class {

    toString () {
        himalaya.stringify(this.toJSON());
    }

    async render (context) {}
    
    _renderError (error) {
        this.toString = () => `<span class="error">${error}</span>`;
    }
}



const Element = Document.Element = class extends Node {

    constructor (tagName, attrList, children) {
        super();
        this.tag = tagName.toLowerCase();
        this.attributes = new Element.Attributes(attrList);
        this.children = new Element.Children(...children);
    }
        
    toJSON () {
        return {
            type: 'element',
            tagName: this.tag,
            attributes: this.attributes.toJSON(),
            children: this.children.map(node => node.toJSON())
        };
    }

    toString () {
        return this.tag !== "" ? `<${this.tag} ${this.attributes}>${this.children}</${this.tag}>` : String(this.children);
    }

    async render (context) {
        try {
            await this.attributes.render(context);
        } catch (error) {
            this._renderError(error);
        }
        
        await this.children.render(context);
    }
}



Element.Attributes = class extends Map {

    constructor (attrList) {
        super();
        for (let attr of attrList) {
            this.set(attr.key, attr.value);
        }
    }

    toJSON () {
        const attrList = [];
        for (let [key, value] of this) {
            attrList.push({key:name, value:this[name]});
        }
        return attrList;
    }

    toString () {
        var attrString = "";
        for (let [key, value] of this) {
            attrString += `${name}="${this[name]}" `;
        }
        return attrString.trim();
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



Element.Children = class extends Array {
    
    constructor (...nodes) {
        super();

        for (let node of nodes) {
            switch (node.type) {

                case 'element':
                    let element = new Element(node.tagName, node.attributes, node.children);
                    let config = elementRegistry[element.tag] || {};
                    if (config && typeof config.decorator === "function") {
                        element = config.decorator(element);
                    }
                    this.push(element);
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
        if (allowedTags === true) return;
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
    
    find (testFn, recursive=true) {
        var match = [];
        for (let node of this) {
            if (testFn(node)) match.push(node);
            if (recursive && node instanceof Element) {
                let subMatch = node.children.find(testFn);
                match = match.concat(subMatch);
            }
        }
        return match;
    }

    toJSON () {
        return this.map(node => node.toJSON());
    }

    toString () {
        return this.map(child => String(child)).join("");
    }

    async render (context) {
        for (let node of this) {
            try {
                await node.render(context);
            } catch (error) {
                node._renderError(error);
            }
        }
    }
    
}


const Text = Document.Text = class extends Node {

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

    toString () {
        return this.content;
    }

    async render (context) {
        this.content = this.content.replace(/\{\{(.+?)\}\}/gm, (match, expr) => {
            let value = expression.eval(expr, context);
            return `<span class="expression">${value}</span>`;
        });
    }
}



const Comment = Document.Comment = class extends Node {

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

    toString () {
        return this.content;
    }
}


function assign (scope, path, value) {
    const pathNames = path.split(".");
    const key = pathNames.pop();
    var obj = scope;
    for (let name of pathNames) {
        obj = obj[name];
    }
    obj[key] = value;
}









const Sanitizer = Document.Sanitizer = (allowedAttributes, allowedTags) => {
    return (element) => {
        const decoratedElement = Object.create(element);

        decoratedElement.render = async function (context) {
            this.attributes.sanitize(allowedAttributes);
            this.children.sanitize(allowedTags);
            await element.render(context);        
        }
        
        return decoratedElement;        
    }
}



const elementRegistry = {

    h1: { decorator: Sanitizer(['class', 'style', 'id'], true) },
    h2: { decorator: Sanitizer(['class', 'style', 'id'], true) },
    h3: { decorator: Sanitizer(['class', 'style', 'id'], true) },
    h4: { decorator: Sanitizer(['class', 'style', 'id'], true) },
    h5: { decorator: Sanitizer(['class', 'style', 'id'], true) },
    h6: { decorator: Sanitizer(['class', 'style', 'id'], true) },

    // lists
    ul: { decorator: Sanitizer(['class', 'style', 'id'], true) },
    ol: { decorator: Sanitizer(['class', 'style', 'id', 'type', 'start'], true) },
    li: { decorator: Sanitizer(['class', 'style', 'id'], true) },
    dl: { decorator: Sanitizer(['class', 'style', 'id'], true) },
    dt: { decorator: Sanitizer(['class', 'style', 'id'], true) },
    dd: { decorator: Sanitizer(['class', 'style', 'id'], true) },

    // tables
    table:    { decorator: Sanitizer(['class', 'style', 'id'], true) },
    thead:    { decorator: Sanitizer(['class', 'style', 'id'], true) },
    tbody:    { decorator: Sanitizer(['class', 'style', 'id'], true) },
    tfoot:    { decorator: Sanitizer(['class', 'style', 'id'], true) },
    caption:  { decorator: Sanitizer(['class', 'style', 'id'], true) },
    col:      { decorator: Sanitizer(['class', 'style', 'id'], true) },
    colgroup: { decorator: Sanitizer(['class', 'style', 'id'], true) },
    tr:       { decorator: Sanitizer(['class', 'style', 'id'], true) },
    th:       { decorator: Sanitizer(['class', 'style', 'id'], true) },
    td:       { decorator: Sanitizer(['class', 'style', 'id'], true) },

    // misc block tags
    p:          { decorator: Sanitizer([ 'class', 'style', 'id' ], true) },
    blockquote: { decorator: Sanitizer([ 'class', 'style', 'id' ], true) },
    pre:        { decorator: Sanitizer([ 'class', 'style', 'id' ], true) },
    div:        { decorator: Sanitizer([ 'class', 'style', 'id' ], true) },
    br:         { decorator: Sanitizer([ 'class', 'style', 'id' ], true) },
    hr:         { decorator: Sanitizer([ 'class', 'style', 'id' ], true) },

    // inline tags
    b:      { decorator: Sanitizer([ 'class', 'style', 'id' ], true) },
    i:      { decorator: Sanitizer([ 'class', 'style', 'id' ], true) },
    strong: { decorator: Sanitizer([ 'class', 'style', 'id' ], true) },
    em:     { decorator: Sanitizer([ 'class', 'style', 'id' ], true) },
    code:   { decorator: Sanitizer([ 'class', 'style', 'id' ], true) },
    a:      { decorator: Sanitizer([ 'class', 'style', 'id', 'href', 'name', 'target' ], true) },
    img:    { decorator: Sanitizer([ 'class', 'style', 'id', 'src', 'alt', 'height', 'width'], true) },
    span:   { decorator: Sanitizer([ 'class', 'style', 'id' ], true) },
}



const documentTemplate = `
<html>

<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{title}}</title>
<meta name="author" content="{{author}}">
<link rel="stylesheet" href="/dist/main.css"></link>
<script src="/dist/client.js"></script>
</head>

<body>
<template id="source">
{{template}}
</template>
</body>

</html>
`;



module.exports = Document;
