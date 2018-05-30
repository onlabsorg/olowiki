
const expression = require("./expression");
const assign = require("./tools/assign");

const himalaya = require("himalaya");
const parseOptions = JSON.parse(JSON.stringify(himalaya.parseDefaults));


class Document {
    
    constructor (docData) {        
        this.title = docData.title;
        this.author = docData.author;
        this.template = docData.template;
    }
    
    async renderTemplate (scope) {
        const nodes = Document.parseHTML(this.template);
        await nodes.render(scope);
        return String(nodes);        
    }    
    
    static defineTag (tagName, tagConfig) {
        tagName = tagName.toLowerCase();
        
        switch (tagConfig.type) {
            
            /*
              Tags which auto-close because they cannot be nested
              For example: <p>Outer<p>Inner is <p>Outer</p><p>Inner</p>
            */
            case 'closing':
                if (parseOptions.closingTags.indexOf(tagName) === -1) {
                    parseOptions.closingTags.push(tagName);
                }
                break;
                
            /*
              Tags which do not need the closing tag
              For example: <img> does not need </img>
            */
            case 'void':
                if (parseOptions.voidTags.indexOf(tagName) === -1) {
                    parseOptions.voidTags.push(tagName);
                }
                break;
                
            /*
              Tag which contain arbitary non-parsed content
              For example: <script> JavaScript should not be parsed
            */        
            case 'childless':
                if (parseOptions.childlessTags.indexOf(tagName) === -1) {
                    parseOptions.childlessTags.push(tagName);
                }
                break;
        }

        tags[tagName] = tagConfig;
    }
    
    defineTags (newTags) {
        for (let tagName of newTags) {
            this.defineTag(tagName, newTags[tagName]);
        }
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
        const srcNodes = himalaya.parse(html, parseOptions);
        return new Document.Nodes(...srcNodes);        
    }
    
    static parse (html) {
        const docData = {
            title: "",
            author: undefined,
            template: ""
        };
        
        const nodes = this.parseHTML(html);
        const elements = nodes.findTags('title', 'meta', 'template');

        if (elements.title.length > 0) {
            docData.title = String(elements.title[0].children);
        }
        
        for (let metaElt of elements.meta) {
            if (metaElt.attributes.name === "author") {
                docData.author = metaElt.attributes.content;
                break;
            }
        }
        
        for (let templateElt of elements.template) {
            if (templateElt.attributes.id === "source") {
                docData.template = String(templateElt.children).trim();
                break;
            }
        }
        
        return new Document(docData);
    }    
}


Document.Nodes = class extends Array {

    constructor (...nodes) {
        super();

        for (let node of nodes) {
            switch (node.type) {

                case 'element':
                    this.push(new Document.Element(node.tagName, node.attributes, node.children));
                    break;

                case 'text':
                    this.push(new Document.Text(node.content));
                    break;

                case 'comment':
                    this.push(new Document.Comment(node.content));
                    break;
            }
        }
    }

    sanitize (allowedTags) {
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
    
    findTags (...tagNames) {
        const elements = {};
        for (let name of tagNames) elements[name] = [];
        for (let node of this) {
            if (node instanceof Document.Element) {
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

    async render (scope) {
        this.sanitize(Object.keys(tags));
        for (let node of this) {
            await node.render(scope);
        }
    }
}



Document.Node = class {

    toString () {
        himalaya.stringify(this.toJSON());
    }
    
    async render (scope) {}
}






Document.Element = class extends Document.Node {

    constructor (tagName, attrList, children) {
        super();
        this.tag = tagName;
        this.attributes = new Document.Element.Attributes(attrList);
        this.children = new Document.Nodes(...children);
    }

    toJSON () {
        return {
            type: 'element',
            tagName: this.tag,
            attributes: this.attributes.toJSON(),
            children: this.children.toJSON()
        };
    }
    
    async render (scope) {
        const tagConfig = tags[this.tag];

        this.attributes.sanitize(tagConfig.allowedAttributes || []);    
        await this.attributes.render(scope);    
        
        await this.children.render(scope);
        
        if (typeof tagConfig.decorator === 'function') {
            await tagConfig.decorator.call(this, scope);
        }    
    }    
}


Document.Element.Attributes = class {

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

    async render (scope) {
        const attrNames = this.getNames();
        for (let attrName of attrNames) {
            let attrValue = this[attrName];
            let matchExpr = attrValue.match(/^\{\{(.*)\}\}$/);
            if (matchExpr) {
                let expr = matchExpr[1];
                this[attrName] = expression.eval(expr, scope);
            }
        }
    }
}



Document.Text = class extends Document.Node {

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
    
    async render (scope) {
        this.content = this.content.replace(/\{\{(.+?)\}\}/gm, (match, expr) => {
            const assignment = expr.match(/^\s*([a-zA-Z_][a-zA-Z_.0-9]*)\s*=\s*(.+)\s*$/);
            if (assignment) {
                let path = assignment[1];
                let value = expression.eval(assignment[2], scope);
                assign(scope, path, value);
                return "";
            } else {
                return expression.eval(expr, scope);
            }
        });
    }    
}



Document.Comment = class extends Document.Node {

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


const tags = {

    h1: {allowedAttributes: [ 'class', 'style', 'id' ]},
    h2: {allowedAttributes: [ 'class', 'style', 'id' ]},
    h3: {allowedAttributes: [ 'class', 'style', 'id' ]},
    h4: {allowedAttributes: [ 'class', 'style', 'id' ]},
    h5: {allowedAttributes: [ 'class', 'style', 'id' ]},
    h6: {allowedAttributes: [ 'class', 'style', 'id' ]},

    // lists
    ul: {allowedAttributes: [ 'class', 'style', 'id' ]},
    ol: {allowedAttributes: [ 'class', 'style', 'id', 'type', 'start' ]},
    li: {allowedAttributes: [ 'class', 'style', 'id' ]},
    dl: {allowedAttributes: [ 'class', 'style', 'id' ]},
    dt: {allowedAttributes: [ 'class', 'style', 'id' ]},
    dd: {allowedAttributes: [ 'class', 'style', 'id' ]},

    // tables
    table:    {allowedAttributes: [ 'class', 'style', 'id' ]},
    thead:    {allowedAttributes: [ 'class', 'style', 'id' ]},
    tbody:    {allowedAttributes: [ 'class', 'style', 'id' ]},
    tfoot:    {allowedAttributes: [ 'class', 'style', 'id' ]},
    caption:  {allowedAttributes: [ 'class', 'style', 'id' ]},
    col:      {allowedAttributes: [ 'class', 'style', 'id' ]},
    colgroup: {allowedAttributes: [ 'class', 'style', 'id' ]},
    tr:       {allowedAttributes: [ 'class', 'style', 'id' ]},
    th:       {allowedAttributes: [ 'class', 'style', 'id' ]},
    td:       {allowedAttributes: [ 'class', 'style', 'id' ]},

    // misc block tags
    p:          {allowedAttributes: [ 'class', 'style', 'id' ]},
    blockquote: {allowedAttributes: [ 'class', 'style', 'id' ]},
    pre:        {allowedAttributes: [ 'class', 'style', 'id' ]},
    div:        {allowedAttributes: [ 'class', 'style', 'id' ]},
    br:         {allowedAttributes: [ 'class', 'style', 'id' ]},
    hr:         {allowedAttributes: [ 'class', 'style', 'id' ]},

    // inline tags
    b:      {allowedAttributes: [ 'class', 'style', 'id' ]},
    i:      {allowedAttributes: [ 'class', 'style', 'id' ]},
    strong: {allowedAttributes: [ 'class', 'style', 'id' ]},
    em:     {allowedAttributes: [ 'class', 'style', 'id' ]},
    code:   {allowedAttributes: [ 'class', 'style', 'id' ]},
    a:      {allowedAttributes: [ 'class', 'style', 'id', 'href', 'name', 'target' ]},
    img:    {allowedAttributes: [ 'class', 'style', 'id', 'src', 'alt', 'height', 'width']},
}



const documentTemplate = `
<html>

<head>
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
