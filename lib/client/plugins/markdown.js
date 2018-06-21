const olo = window.olo;
const unindent = require("../utils/unindent");


module.exports = function (options={}) {
    
    olo.Document.decorators.set('markdown', (element) => {
        const markdownElt = Object.create(element);
        markdownElt._html = "";
        markdownElt.render = async function (context) {
            const marked = (await import(/* webpackChunkName: "marked" */ "marked")).default;        
            const markdown = unindent( String(this.children) );
            this._html = marked(markdown, options);                
        }
        markdownElt.toString = () => markdownElt._html;
        return markdownElt;
    });
}
