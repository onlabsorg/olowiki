
const store = require("store");

const marked = require("marked");
const sanitize = require("utils/sanitize");
const OloVDOM = require("olo-vdom");
const oloViewerStyle = require("olo-viewer/olo-viewer.css!text");

const context = require("olo-viewer/context");
const allowedTags = require("olo-viewer/allowed-tags");
const markdownOptions = {}



class OloViewer extends OloVDOM {

    static get template () {
        return `<style>${oloViewerStyle}</style><vdom></vdom>`;
    }

    static get context () {
        return context;
    }

    static get markdownOptions () {
        return markdownOptions;
    }

    static get allowedTags () {
        return allowedTags;
    }


    // RENDERING

    async render () {
        if (this.model === null) return "";

        const markdown = await this.model.render(this.constructor.context);
        const html = marked(markdown, this.constructor.markdownOptions);
        return sanitize(html, this.constructor.allowedTags);
    }
}



module.exports = OloViewer.register("olo-viewer");
