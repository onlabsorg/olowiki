
const nunjucks = require("nunjucks");



class Loader extends nunjucks.Loader {

    constructor (cnode) {
        super();
        this.cnode = cnode;
    }

    getSource (path) {
        const targetNode = this.cnode.root.getNode(path);
        if (targetNode) {
            let path = targetNode.path;
            let template = targetNode.value;
            return {src:template, path:path, noCache:true};
        }
        else {
            return null;
        }
    }

    isRelative (nodePath) {
        return (nodePath.indexOf('./') === 0 || nodePath.indexOf('../') === 0 || nodePath[0] !== "/");
    }

    resolve (from, to) {
        return from + "/" + to;
    }
}



const config = {
    context: {},
};


async function render (node) {
    return new Promise((resolve, reject) => {
        loader = new Loader(node);
        environment = new nunjucks.Environment(loader);
        const template = new nunjucks.Template(node.value, environment, node.path);
        template.render(config.context, function (err, res) {
            if (err) reject(err);
            else resolve(res);
        });
    });
}


exports.config = config;
exports.abstract = require("model/abstract-model");
exports.memory = require("model/memory-model");
exports.google = require("model/google-model");
exports.render = render;
