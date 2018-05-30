const olo = require("../../olo");
const unindent = require("../utils/unindent");


module.exports = function (options={}) {
    
    olo.Document.defineTag('markdown', {
        
        type: 'childless',
        
        allowedAttributes: [],
        
        async decorator (scope) {
            const marked = (await import(/* webpackChunkName: "marked" */ "marked")).default;        
            const markdown = unindent( String(this.children) );
            const html = marked(markdown, options);
            this.children = olo.Document.parseHTML(html);
        }
    });
}
