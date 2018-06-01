const olo = window.olo;
const unindent = require("../utils/unindent");


module.exports = function (options={}) {
    
    olo.Document.defineTag('markdown', {
        
        allowedAttributes: [],
        
        async decorator (scope) {
            const marked = (await import(/* webpackChunkName: "marked" */ "marked")).default;        
            const markdown = unindent( String(this.children) );
            return marked(markdown, options);
        }
    });
}
