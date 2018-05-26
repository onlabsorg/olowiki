const olo = require("../../olo");

module.exports = function (options={}) {
    
    olo.engine.defineTag('markdown', {
        
        type: 'childless',
        
        allowedAttributes: [],
        
        async decorator (scope) {
            const marked = (await import(/* webpackChunkName: "marked" */ "marked")).default;        
            const markdown = String(this.children);
            console.log(markdown)
            const html = marked(markdown, options);
            console.log(html);
            this.children = olo.engine.parseHTML(html);
        }
    });
}
