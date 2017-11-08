
const marked = require("marked");
const sanitize = require("utils/sanitize");
const OloVDOM = require("olo-vdom");
const oloViewerStyle = require("olo-viewer/olo-viewer.css!text");



class OloViewer extends OloVDOM {

    static get template () {
        return `<style>${oloViewerStyle}</style><vdom></vdom>`;
    }



    // RENDERING

    async render () {
        if (this.model === null) return "";

        const config = this.constructor.config;
        const markdown = await this.model.render();
        const html = marked(markdown, config.markdown);
        return sanitize(html, config.allowedTags);
    }
}



OloViewer.config.markdown = {}

OloViewer.config.allowedTags = {
    '*': [ 'http:', 'https:', 'ftp:', 'mailto:', 'class', 'style', 'id', 'slot' ],

    // headers
    'h1': [],
    'h2': [],
    'h3': [],
    'h4': [],
    'h5': [],
    'h6': [],

    // lists
    'ul': [],
    'ol': [ 'type', 'start' ],
    'li': [],
    'dl': [],
    'dt': [],
    'dd': [],

    // tables
    'table': [],
    'thead': [],
    'tbody': [],
    'tfoot': [],
    'caption': [],
    'col': [],
    'colgroup': [],
    'tr': [],
    'th': [],
    'td': [],

    // misc block tags
    'p': [],
    'blockquote': [],
    'pre': [],
    'div': [],
    'br': [ '<>' ],
    'hr': [ '<>' ],

    // inline tags
    'b': [],
    'i': [],
    'strong': [],
    'em': [],
    'code': [],
    'a': [ 'href', 'name', 'target' ],
    'img': [ 'src', 'alt', 'height', 'width' , '<>' , "http:"],

    // olo-elements
    'olo-viewer': ['href'],
};



module.exports = OloViewer.register("olo-viewer");
