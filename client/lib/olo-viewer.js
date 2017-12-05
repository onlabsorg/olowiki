
const model = require("model");
const Path = require("olojs/path");

const marked = require("marked");
const sanitize = require("utils/sanitize");
const OloVDOM = require("olo-vdom");
const oloViewerStyle = require("olo-viewer/olo-viewer.css!text");

const context = require("olo-viewer/context");
const allowedTags = require("olo-viewer/allowed-tags");
const markdownOptions = {}



const nunjucks = require("nunjucks");

class NunjucksLoader extends nunjucks.Loader {

    constructor (path) {
        super();
        this.path = Path.parse(path);
    }

    getSource (subPath) {
        const fullPath = Path.parse(this.path, subPath);
        const template = model.getModel(`${fullPath}/__template__`);
        if (typeof template !== "string") return null;
        
        return {
            src: template,
            path: String(fullPath),
            noCache: true
        };
    }

    isRelative (subPath) {
        return (subPath.indexOf('./') === 0 || subPath.indexOf('../') === 0 || subPath[0] !== "/");
    }

    resolve (from, to) {
        return String(Path.parse(from, to));
    }
}




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

    render () {

        const nunjucksLoader = new NunjucksLoader(this.modelPath);
        const nunjucksEnvironment = new nunjucks.Environment(nunjucksLoader);
        const template = new nunjucks.Template(model.getModel(`${this.modelPath}/__template__`), nunjucksEnvironment, String(this.modelPath));

        const context = this.constructor.context;
        const markdown = template.render(context);

        const markdownOptions = this.constructor.markdownOptions;
        const html = marked(markdown, markdownOptions);

        const allowedTags = this.constructor.allowedTags;
        return sanitize(html, allowedTags);
    }
}



module.exports = OloViewer.register("olo-viewer");
