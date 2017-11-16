
const OloComponent = require("olo-component");
const OloNode = require("./olo-tree/olo-node");
const oloTreeTemplate = require("./olo-tree/olo-tree.html!text");

class OloTree extends OloComponent {

    static get template () {
        return oloTreeTemplate;
    }

    constructor () {
        super();
        this.addEventListener("olo-node-selected", (event) => {
            const nodeElt = event.detail.oloNode;
            if (this.selectedNode && this.selectedNode !== nodeElt) {
                this.selectedNode.unselect();
            }
            this._selectedNode = nodeElt;
        });
    }

    get document () {
        return this.$("olo-root").document;
    }

    set document (doc) {
        this.$("olo-root").document = doc;
    }

    get root () {
        return this.$("olo-node");
    }

    get selectedNode () {
        return this._selectedNode || null;
    }
}

module.exports = OloTree.register("olo-tree");
