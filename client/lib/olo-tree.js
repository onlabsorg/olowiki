
const Value = require("olojs/value");
const Path = require("olojs/path");

const Model = require("model");

const OloVDOM = require("olo-vdom");
const OloTreeNode = require("./olo-tree/olo-tree-node");



class OloTree extends OloVDOM {

    static get template () {
        return "<vdom></vdom>"
    }

    constructor () {
        super();
        this._expandedNodes = new Set();

        this.addEventListener("olo-tree-node-icon-click", event => {
            const nodeModelPath = event.detail.path;
            if (this.isCollapsed(nodeModelPath)) this.expand(nodeModelPath);
            else this.collapse(nodeModelPath);
        });
    }

    render () {
        const rootModel = new Model(this.model.document, "/");
        if (rootModel.type() !== "Object") {
            return "void";
        }

        const selectedPathStr = this.model.path.toString();

        const classList = [];
        classList.push("root");
        if (selectedPathStr === "/") classList.push("selected");
        let classAttr = classList.join(" ");

        const nodeChildren = this._renderNodeList(rootModel);

        return `
            <olo-tree-node class="${classAttr}" model="/">
                ${nodeChildren}
            </olo-tree-node>
        `;
    }

    isCollapsed (path) {
        path = Path.parse(path).toString();
        return !this._expandedNodes.has(path) && path !== "/";
    }

    expand (path) {
        path = Path.parse(path).toString();
        this._expandedNodes.add(path);
        this.updateView();
    }

    collapse (path) {
        path = Path.parse(path).toString();
        this._expandedNodes.delete(path);
        this.updateView();
    }

    getChildPaths (path) {
        if (!this.model) return [];
        path = Path.parse(path);
        const model = new Model(this.model.document, path);
        if (model.type() !== 'Object') return [];
        const childNames = this._getChildNames(model);
        const basePathStr = path.length > 0 ? String(path) : "";
        return childNames.map(name => `${basePathStr}/${name}`);
    }

    getSiblingPaths (path) {
        const parentPath = Path.parse(path).parent;
        return this.getChildPaths(parentPath);
    }

    getPreviousSiblingPath (path) {
        path = Path.parse(path).toString();
        const siblingPaths = this.getSiblingPaths(path);
        for (let i=0; i<siblingPaths.length; i++) {
            if (path === String(siblingPaths[i])) return siblingPaths[i-1];
        }
    }

    getNextSiblingPath (path) {
        path = Path.parse(path).toString();
        const siblingPaths = this.getSiblingPaths(path);
        for (let i=0; i<siblingPaths.length; i++) {
            if (path === String(siblingPaths[i])) return siblingPaths[i+1];
        }
    }

    _renderNodeList (model) {
        const modelPath = String(model.path);
        const names = this._getChildNames(model);
        const selectedPathStr = this.model.path.toString();

        var html = "";
        for (let name of names) {
            let nodeModel = model.getSubModel(name);
            let nodeModelPathStr = String(nodeModel.path);

            let classList = [];
            if (selectedPathStr === nodeModelPathStr) classList.push("selected");
            let classAttr = classList.join(" ");

            let collapsedAttr = this.isCollapsed(nodeModelPathStr) ? "collapsed" : "";

            let nodeChildren = this._renderNodeList(nodeModel);

            html += `
                <olo-tree-node slot="child" class="${classAttr}" ${collapsedAttr} model="./${name}">
                    ${nodeChildren}
                </olo-tree-node>
            `;
        }
        return html;
    }

    _getChildNames (model) {
        return Object.keys(model.get())
                .filter(key => model.get(key)[0] !== "_" && model.type(key) === "Object")
                .sort();
    }
}






module.exports = OloTree.register("olo-tree");
