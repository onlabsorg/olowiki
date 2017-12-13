
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

    constructor (model) {
        super();
        this.model = model;
    }

    getSource (subPath) {
        const subModel = this.model.getSubModel(subPath);
        const template = subModel.get("__template__");
        if (typeof template !== "string") return null;

        return {
            src: template,
            path: String(subModel.path),
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
        const __template__ = this.model.get("__template__");
        if (typeof __template__ !== "string") return "";

        const nunjucksLoader = new NunjucksLoader(this.model);
        const nunjucksEnvironment = new nunjucks.Environment(nunjucksLoader);
        const templatePathStr = String(this.model.path);
        const template = new nunjucks.Template(__template__, nunjucksEnvironment, templatePathStr);

        const context = this.constructor.context;
        const markdown = template.render(context);

        const markdownOptions = this.constructor.markdownOptions;
        const html = marked(markdown, markdownOptions);

        const allowedTags = this.constructor.allowedTags;
        return sanitize(html, allowedTags);
    }
}



module.exports = OloViewer.register("olo-viewer");
