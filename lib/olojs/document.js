
const expression = require("./expression");

const DOM = require("./dom");

const himalaya = require("himalaya");





class Document {

    constructor (docData) {
        this.title = docData.title;
        this.author = docData.author;
        this.template = docData.template;
    }

    async renderTemplate (context) {
        const templateNodes = Document.parseHTML(this.template);
        templateNodes.sanitize(Array.from(Element.decorators.keys()));
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
        .replace("{{template}}", this.template)
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

        const templateElt = nodes.find(node => node.tag === 'script' && node.attributes.get("type") === 'text/template')[0];
        docData.template = templateElt ? String(templateElt.children).trim() : "";

        return new Document(docData);
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
            attrString += `${key}="${value}" `;
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
                    let decorator = Element.decorators.get(element.tag);
                    if (typeof decorator === "function") {
                        element = decorator(element);
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



const Sanitizer = Element.Sanitizer = (allowedAttributes, allowedTags) => {
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



Element.decorators = new Map([

    ['h1', Sanitizer(['class', 'style', 'id'], true)],
    ['h2', Sanitizer(['class', 'style', 'id'], true)],
    ['h3', Sanitizer(['class', 'style', 'id'], true)],
    ['h4', Sanitizer(['class', 'style', 'id'], true)],
    ['h5', Sanitizer(['class', 'style', 'id'], true)],
    ['h6', Sanitizer(['class', 'style', 'id'], true)],

    // lists
    ['ul', Sanitizer(['class', 'style', 'id'], true)],
    ['ol', Sanitizer(['class', 'style', 'id', 'type', 'start'], true)],
    ['li', Sanitizer(['class', 'style', 'id'], true)],
    ['dl', Sanitizer(['class', 'style', 'id'], true)],
    ['dt', Sanitizer(['class', 'style', 'id'], true)],
    ['dd', Sanitizer(['class', 'style', 'id'], true)],

    // tables
    ['table',    Sanitizer(['class', 'style', 'id'], true)],
    ['thead',    Sanitizer(['class', 'style', 'id'], true)],
    ['tbody',    Sanitizer(['class', 'style', 'id'], true)],
    ['tfoot',    Sanitizer(['class', 'style', 'id'], true)],
    ['caption',  Sanitizer(['class', 'style', 'id'], true)],
    ['col',      Sanitizer(['class', 'style', 'id'], true)],
    ['colgroup', Sanitizer(['class', 'style', 'id'], true)],
    ['tr',       Sanitizer(['class', 'style', 'id'], true)],
    ['th',       Sanitizer(['class', 'style', 'id'], true)],
    ['td',       Sanitizer(['class', 'style', 'id'], true)],

    // misc block tags
    ['p',          Sanitizer([ 'class', 'style', 'id' ], true)],
    ['blockquote', Sanitizer([ 'class', 'style', 'id' ], true)],
    ['pre',        Sanitizer([ 'class', 'style', 'id' ], true)],
    ['div',        Sanitizer([ 'class', 'style', 'id' ], true)],
    ['br',         Sanitizer([ 'class', 'style', 'id' ], true)],
    ['hr',         Sanitizer([ 'class', 'style', 'id' ], true)],

    // inline tags
    ['b',      Sanitizer([ 'class', 'style', 'id' ], true)],
    ['i',      Sanitizer([ 'class', 'style', 'id' ], true)],
    ['strong', Sanitizer([ 'class', 'style', 'id' ], true)],
    ['em',     Sanitizer([ 'class', 'style', 'id' ], true)],
    ['code',   Sanitizer([ 'class', 'style', 'id' ], true)],
    ['a',      Sanitizer([ 'class', 'style', 'id', 'href', 'name', 'target' ], true)],
    ['img',    Sanitizer([ 'class', 'style', 'id', 'src', 'alt', 'height', 'width'], true)],
    ['span',   Sanitizer([ 'class', 'style', 'id' ], true)],
]);



const documentTemplate = `
<html>
<!DOCTYPE html>

<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{title}}</title>
<meta name="author" content="{{author}}">
<link rel="stylesheet" href="/dist/main.css"></link>
<script src="/dist/client.js"></script>
</head>

<body>
<script type="text/template">
{{template}}
</script>
</body>

</html>
`;



module.exports = Document;
