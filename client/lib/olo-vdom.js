
const OloComponent = require("olo-component");

const h = require("virtual-dom/h");
const diff = require("virtual-dom/diff");
const patch = require("virtual-dom/patch");
const createElement = require("virtual-dom/create-element");
const VNode = require("virtual-dom/vnode/vnode");
const VText = require("virtual-dom/vnode/vtext");

const HTMLToVDOM = require("html-to-vdom");
const htmlToVDOM = HTMLToVDOM({VNode:VNode, VText:VText});

const Feature = require("utils/Feature");



class OloVDOM extends OloComponent {

    static get template () {
        return "<vdom></vdom>";
    }



    // LIFE CYCLE

    constructor () {
        super();

        const newVDOM = this._VDOM = h('vdom', {}, []);
        this._rootNode = createElement(newVDOM);

        const vdomElt = this.shadowRoot.querySelector("vdom");
        vdomElt.parentNode.replaceChild(this._rootNode, vdomElt);

        this._pendingViewUpdate = Promise.resolve();
    }



    // RENDERING

    updateView () {
        const awaitPendingViewUpdate = this._pendingViewUpdate;
        this._pendingViewUpdate = new Feature();

        awaitPendingViewUpdate.then(() => {
            return this.render()
        })
        .then((content) => {
            const oldVDOM = this._VDOM;
            const vnodes = (typeof content === "string" && content !== "") ? htmlToVDOM(content) : content;
            const newVDOM = this._VDOM = h('vdom', {}, vnodes);
            const patches = diff(oldVDOM, newVDOM);
            patch(this._rootNode, patches);
            
            this._pendingViewUpdate.resolve();
            this.dispatch("olo-vdom-ready", {component:this});
        })
        .catch((error) => {
            throw error;
        });
    }

    async render () {
        // custom content here
        // can return an HTML markup string or virtual-dom nodes
    }
}


module.exports = OloVDOM.register("olo-vdom");
