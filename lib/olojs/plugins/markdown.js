const unindent = require("../utils/unindent");
const marked = require("marked");


module.exports = function (Document, options={}) {
    
    Document.Element.decorators.set('markdown', (element) => {
        const markdownElt = Object.create(element);
        
        const expressions = [];
        const markdown = unindent( element.children.toHTML() ).replace(/\{\{(.+?)\}\}/gm, (match, expression) => {
            expressions.push(expression)
            return `{{${expressions.length - 1}}}`
        });        
        const html = marked(markdown, options).replace(/\{\{([0-9]+)\}\}/gm, (mathc, index) => {
            return `{{${expressions[index]}}}`
        });
        
        markdownElt.children = Document.parse(html);
        markdownElt.children.find(node => node.tag === "code").forEach(codeElt => {
            const code = String(Document.parse(String(codeElt.children)))
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;");
            codeElt.children = new Document.Node.List();
            codeElt.toHTML = codeElt.toString = () => code;
        });
        return markdownElt;
    });
}
