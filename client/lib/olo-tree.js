
const OloNode = require("./olo-tree/olo-node");

class OloTree extends OloNode {

    constructor () {
        super();
        this.classList.add("root");
        this.addEventListener("olo-node-selected", (event) => {
            const nodeElt = event.detail.oloNode;
            if (this.selectedNode && this.selectedNode !== nodeElt) {
                this.selectedNode.unselect();
            }
            this._selectedNode = nodeElt;
        });
    }

    get selectedNode () {
        return this._selectedNode || null;
    }

    set collapsed (value) {}

    findNodeByPath (path) {
        return this.findItem((node) => node.model.path === path);
    }
}

module.exports = OloTree.register("olo-tree");
