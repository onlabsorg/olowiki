const olo = require("../../olo");

module.exports = function (options={}) {
    
    olo.engine.defineTag('markdown', {
        
        type: 'childless',
        
        allowedAttributes: [],
        
        async decorator (scope) {
            const marked = (await import(/* webpackChunkName: "marked" */ "marked")).default;        
            const markdown = olo.tools.unindent( String(this.children) );
            const html = marked(markdown, options);
            this.children = olo.engine.parseHTML(html);
        }
    });
}
