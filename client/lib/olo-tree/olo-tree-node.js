
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
        this.$("#icon").addEventListener('click', () => this.dispatch("olo-tree-node-icon-click", {node:this}));
        this.$("#value").addEventListener('click', () => this.dispatch("olo-tree-node-value-click", {node:this}));
    }

    attributeChangedCallback (attrName, oldVal, newVal) {
        super.attributeChangedCallback(attrName, oldVal, newVal);
        switch (attrName) {
            case "collapsed":
                this.updateView();
                break;
        }
    }

    updateView () {
        this.$("#icon").textContent = (this.hasAttribute("collapsed")) ? collapsedIcon : expandedIcon;
        this.$("#value").textContent = this.modelPath ? this.modelPath.leaf : "";
    }
}

module.exports = OloNode.register("olo-tree-node");
