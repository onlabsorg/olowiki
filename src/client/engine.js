
const DOM = require("./engine/dom");
const expression = require("./engine/expression");

const getOwnProperties = require("./utils/get-own-properties");


function parseDocument (html) {
    
    const doc = {
        title: "",
        author: undefined,
        template: undefined
    }
    
    const nodes = DOM.parse(html);
    const elements = nodes.findTags('title', 'meta', 'template');

    if (elements.title.length > 0) {
        doc.title = String(elements.title[0].children);
    }
    
    for (let metaElt of elements.meta) {
        if (metaElt.attributes.name === "author") {
            doc.author = metaElt.attributes.content;
            break;
        }
    }
    
    for (let templateElt of elements.template) {
        if (templateElt.attributes.id === "source") {
            doc.template = String(templateElt.children);
            break;
        }
    }
    
    return doc;
}



async function render (template, scope) {
    const nodes = DOM.parse(template);
    await nodes.render(scope);
    return String(nodes);
}



DOM.Nodes.prototype.render = async function (scope) {
    this.sanitize(Object.keys(config.elements));
    for (let node of this) {
        await node.render(scope);
    }
}



DOM.Element.prototype.render = async function (scope) {
    const cfg = config.elements[this.tag];

    this.attributes.sanitize(cfg.allowedAttributes || []);    
    await this.attributes.render(scope);    
    
    if (typeof cfg.beforeRendering === 'function') {
        await cfg.beforeRendering.call(this, scope);
    }
    
    await this.children.render(scope);
    
    if (typeof cfg.afterRendering === 'function') {
        await cfg.afterRendering.call(this, scope);
    }    
}



DOM.Attributes.prototype.render = async function (scope) {
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



DOM.Text.prototype.render = async function (scope) {
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



DOM.Comment.prototype.render = async function (scope) {};



function assign (scope, path, value) {
    const pathNames = path.split(".");
    const key = pathNames.pop();
    var obj = scope;
    for (let name of pathNames) {
        obj = obj[name];
    }
    obj[key] = value;
}



const config = {

    elements: {

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
    },
}



exports.parseDocument = parseDocument;
exports.render = render;
exports.config = config;
