const model = require("model");

const OloComponent = require("olo-component");
const oloTreeNodeTemplate = require("./olo-tree-node.html!text");


const collapsedIcon = "\u25ba";
const expandedIcon = "\u25bc";



class OloNode extends OloComponent {

    static get template () {
        return oloTreeNodeTemplate;
    }

    static get observedAttributes () {
        return super.observedAttributes.concat("collapsed");
    }


    constructor () {
        super();
        this.$("#icon").addEventListener('click', () => this.dispatch("olo-tree-node-icon-click", {path:this.model.path}));
        this.$("#value").addEventListener('click', () => this.dispatch("olo-tree-item-click", {path:this.model.path}));
    }

    collapsedAttributeChangedCallback (oldVal, newVal) {
        this.updateView();
    }

    updateView () {
        this.$("#icon").textContent = (this.hasAttribute("collapsed")) ? collapsedIcon : expandedIcon;
        if (!this.model) {
            this.$("#value").textContent = "";
        } else if (this.model.path.length === 0) {
            this.$("#value").textContent = this.model.document.name;
        } else {
            this.$("#value").textContent = this.model.path.leaf;
        }
    }
}

module.exports = OloNode.register("olo-tree-node");
