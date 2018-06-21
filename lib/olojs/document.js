
const expression = require("./expression");

const DOM = require("./dom");






class Document {

    constructor (xml) {
        this.title = "";
        this.author = undefined;
        this.template = "";
        
        const nodes = DOM.parse(xml);
        for (let node of nodes) {
            
            if (node instanceof DOM.Element && node.tag === "title") {
                this.title = String(node.children);
            }
            
            if (node instanceof DOM.Element && node.tag === "author") {
                this.author = node.attributes.get("id");
            }
            
            if (node instanceof DOM.Element && node.tag === "content") {
                this.template = String(node.children).trim();
            }
        }
    }
    
    async render (context) {
        const templateNodes = DOM.parse(this.template);
        templateNodes.decorate(Document.decorators);
        
        const allowedTags = Array.from(Document.decorators.keys());
        templateNodes.sanitize(allowedTags);
        
        await templateNodes.render(context);
        
        return templateNodes;
    }

    toString () {
        return documentTemplate
        .replace("{{title}}", this.title)
        .replace("{{author}}", this.author)
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



DOM.Node.List.prototype.render = async function (context) {
    for (var node of this) {
        try {
            await node.render(context);
        } catch (error) {
            node._renderError(error);
        }
    }    
}

DOM.Node.List.prototype.decorate = function (decorators) {
    for (let i=0; i<this.length; i++) {
        if (this[i] instanceof DOM.Element) {
            let decorator = decorators.get(this[i].tag);
            if (typeof decorator === "function") {
                this[i] = decorator(this[i]);
            }
            this[i].children.decorate(decorators);
        }
    }
}




const Sanitizer = DOM.Element.Sanitizer = (allowedAttributes, allowedTags) => {
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



Document.decorators = new Map([

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



function renderError (error) {
    return `<span class="error">${error}</span>`;
}




const documentTemplate = `
<title>{{title}}</title>
<author id="{{author}}" />
<content>
{{template}}
</content>
`;





module.exports = Document;
