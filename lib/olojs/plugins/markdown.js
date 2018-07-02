const unindent = require("../utils/unindent");
const marked = require("marked");


module.exports = function (Document, options={}) {
    
    Document.decorators.set('markdown', (element) => {
        const markdownElt = Object.create(element);
        const markdown = unindent( String(element.children) );
        const html = marked(markdown, options);
        markdownElt.children = Document.parse(html);
        return markdownElt;
    });
}
