
const OloComponent = require("olo-component");

const h = require("virtual-dom/h");
const diff = require("virtual-dom/diff");
const patch = require("virtual-dom/patch");
const createElement = require("virtual-dom/create-element");
const VNode = require("virtual-dom/vnode/vnode");
const VText = require("virtual-dom/vnode/vtext");

const HTMLToVDOM = require("html-to-vdom");
const htmlToVDOM = HTMLToVDOM({VNode:VNode, VText:VText});



class OloVDOM extends OloComponent {

    static get template () {
        return "<vdom></vdom>";
    }



    // LIFE CYCLE

    constructor () {
        super();

        this._VDOM = h('vdom', {}, []);
        this._rootNode = createElement(this._VDOM);

        const vdomElt = this.shadowRoot.querySelector("vdom");
        vdomElt.parentNode.replaceChild(this._rootNode, vdomElt);

        this._pendingViewUpdate = Promise.resolve();
    }



    // RENDERING

    updateView () {
        const content = this.render();
        const oldVDOM = this._VDOM;
        const vnodes = (typeof content === "string" && content !== "") ? htmlToVDOM(content) : content;
        const newVDOM = this._VDOM = h('vdom', {}, vnodes);
        const patches = diff(oldVDOM, newVDOM);
        patch(this._rootNode, patches);
    }

    render () {
        // custom content here
        // can return an HTML markup string or virtual-dom nodes
    }
}


module.exports = OloVDOM.register("olo-vdom");
