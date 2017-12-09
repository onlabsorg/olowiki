
const Value = require("olojs/value");
const Path = require("olojs/path");

const model = require("model");

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
            const nodeModelPath = event.detail.node.modelPath;
            if (this.isCollapsed(nodeModelPath)) this.expand(nodeModelPath);
            else this.collapse(nodeModelPath);
        });

        this.addEventListener("olo-tree-node-value-click", event => {
            this.selectedNodePath = event.detail.node.modelPath;
            event.stopPropagation();
        });
    }


    render () {
        const model = this.model;
        if (Value.type(this.model) !== "Object") {
            return "void";
        }

        const nodeModelPath = this.modelPath.toString();

        const classList = [];
        classList.push("root");
        if (this.selectedNodePath === nodeModelPath) classList.push("selected");
        let classAttr = classList.join(" ");

        const nodeChildren = this._renderNodeList(nodeModelPath, model);

        return `
            <olo-tree-node class="${classAttr}" model=".">
                ${nodeChildren}
            </olo-tree-node>
        `;
    }

    get selectedNodePath () {
        return this._selectedNodePath || this.modelPath.toString();
    }

    set selectedNodePath (path) {
        this._selectedNodePath = Path.parse(path).toString();
        this.updateView();
        this.dispatch("olo-tree-node-selected", {path: this._selectedNodePath});
    }

    getChildNames (path) {
        const modelValue = model.getModel(path);
        return Object.keys(modelValue)
                .filter(key => modelValue[key][0] !== "_" && Value.type(modelValue[key]) === "Object")
                .sort();
    }

    isCollapsed (path) {
        path = Path.parse(path).toString();
        return !this._expandedNodes.has(path);
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

    _renderNodeList (modelPath, model) {
        const names = this.getChildNames(modelPath);
        var html = "";
        for (let name of names) {
            let nodeModel = model[name];
            let nodeModelPath = `${modelPath}/${name}`;

            let classList = [];
            if (this.selectedNodePath === nodeModelPath) classList.push("selected");
            let classAttr = classList.join(" ");

            let collapsedAttr = this.isCollapsed(nodeModelPath) ? "collapsed" : "";

            let nodeChildren = this._renderNodeList(nodeModelPath, nodeModel);

            html += `
                <olo-tree-node slot="child" class="${classAttr}" ${collapsedAttr} model="./${name}">
                    ${nodeChildren}
                </olo-tree-node>
            `;
        }
        return html;
    }
}

module.exports = OloTree.register("olo-tree");
