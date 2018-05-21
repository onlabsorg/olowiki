
const DOM = require("./engine/dom");

const getOwnProperties = require("./utils/get-own-properties");



async function render (docData, context) {
    const rendering = {};

    for (let section of docData.sections) {
        let scope = Object.create(context);
        rendering[section.name] = await renderTemplate(section.template, scope);
        context[section.name] = getOwnProperties(scope);
    }

    return rendering;
}



async function renderTemplate (template, scope) {
    const nodeList = DOM.parse(template);
    console.log(nodeList);
    await renderNodeList(nodeList, scope);
    return String(nodeList);
}



async function renderNodeList (nodeList, scope) {
    nodeList.sanitize(Object.keys(config.elements));
    for (let node of nodeList) {
        await renderNode(node, scope);
    }
}


async function renderNode (node, scope) {
    if (node instanceof DOM.Element) {
        await renderElement(node, scope);
        
    } else if (node instanceof DOM.TextNode) {
        await renderTextNode(node, scope);
        
    } else if (node instanceof DOM.CommentNode) {
        await renderCommentNode(node, scope)
        
    }
}



async function renderElement (element, scope) {
    await renderNodeList(element.children, scope);
    await renderAttributes(element.attributes, scope);
    await config.elements[element.tag].call(element, scope);
}



async function renderAttributes (attributes, scope) {} 



async function renderTextNode (textNode, scope) {}



async function renderCommentNode (commentNode, scope) {}



const AttrSanitizer = allowedAttributes => async function (scope) {
    this.attributes.sanitize(allowedAttributes);
}



const config = {

    markdownOptions: {},

    elements: {

        h1: AttrSanitizer([]),
        h2: AttrSanitizer([]),
        h3: AttrSanitizer([]),
        h4: AttrSanitizer([]),
        h5: AttrSanitizer([]),
        h6: AttrSanitizer([]),

        // lists
        ul: AttrSanitizer([]),
        ol: AttrSanitizer([ 'type', 'start' ]),
        li: AttrSanitizer([]),
        dl: AttrSanitizer([]),
        dt: AttrSanitizer([]),
        dd: AttrSanitizer([]),

        // tables
        table: AttrSanitizer([]),
        thead: AttrSanitizer([]),
        tbody: AttrSanitizer([]),

        tfoot: AttrSanitizer([]),
        caption: AttrSanitizer([]),
        col: AttrSanitizer([]),
        colgroup: AttrSanitizer([]),
        tr: AttrSanitizer([]),
        th: AttrSanitizer([]),
        td: AttrSanitizer([]),

        // misc block tags
        p: AttrSanitizer([]),
        blockquote: AttrSanitizer([]),
        pre: AttrSanitizer([]),
        div: AttrSanitizer([]),
        br: AttrSanitizer([]),
        hr: AttrSanitizer([]),

        // inline tags
        b: AttrSanitizer([]),
        i: AttrSanitizer([]),
        strong: AttrSanitizer([]),
        em: AttrSanitizer([]),
        code: AttrSanitizer([]),
        a: AttrSanitizer([ 'href', 'name', 'target' ]),
        img: AttrSanitizer([ 'src', 'alt', 'height', 'width' , '<>' , "http:"]),
    },
}




exports.render = render;
exports.AttrSanitizer = AttrSanitizer;
exports.config = config;


// for test only
exports.renderTemplate = renderTemplate;
