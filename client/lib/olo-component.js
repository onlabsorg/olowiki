
const model = require("model");
const Path = require("olojs/path");

const $parentComponent = Symbol("olo-component.$parentComponent");
const $childComponents = Symbol("olo-component.$childComponents");
const $modelPath = Symbol("olo-component.$modelPath");
const $modelChangeCallback = Symbol("olo-component.$modelChangeCallback");
const $documentChangeCallback = Symbol("olo-component.$documentChangeCallback");


class OloComponent extends HTMLElement {

    static get template () {
        return "<slot></slot>";
    }

    static get observedAttributes () {
        return ['model'];
    }

    static register (tag) {
        customElements.define(tag, this);
        return this;
    }



    // LIFE CYCLE

    constructor () {
        super();
        this.attachShadow({mode: 'open'});


        this[$parentComponent] = null;
        this[$childComponents] = new Set();
        this.addEventListener("olo-component-connected", (event) => {
            if (event.detail !== this) {
                this._registerChild(event.detail);
                event.stopPropagation();
            }
        });


        this[$modelPath] = null;

        this[$modelChangeCallback] = changes => {
            const fullModelPath = Path.parse('data', this.modelPath);
            const relevantChanges = changes.map(change => change.getSubChange(fullModelPath)).filter(change => change !== null);
            if (relevantChanges.length > 0) this.updateView();
        };

        this[$documentChangeCallback] = (oldDocument, newDocument) => {
            oldDocument.changeCallbacks.delete(this[$modelChangeCallback]);
            newDocument.changeCallbacks.add(this[$modelChangeCallback]);
            this.updateView();
        }


        this.shadowRoot.innerHTML = this.constructor.template;
    }

    connectedCallback () {
        model.getDocument().changeCallbacks.add(this[$modelChangeCallback]);
        model.documentChangeCallbacks.add(this[$documentChangeCallback]);
        this.dispatch("olo-component-connected", this);
    }

    attributeChangedCallback (attrName, oldVal, newVal) {
        if (attrName === "model") this._updateModelPath();
    }

    disconnectedCallback () {
        model.getDocument().changeCallbacks.delete(this[$modelChangeCallback]);
        model.documentChangeCallbacks.delete(this[$documentChangeCallback]);
        if (this.parentComponent) {
            this.parentComponent._unregisterChild(this);
        }
    }



    // CHILD COMPONENTS

    get parentComponent () {
        return this[$parentComponent];
    }

    get childComponents () {
        return (function * () {
            for (let childComponent of this[$childComponents]) yield childComponent;
        }).call(this);
    }

    _registerChild (child) {
        child[$parentComponent] = this;
        this[$childComponents].add(child);
        child._updateModelPath();
    }

    _unregisterChild (child) {
        if (this[$childComponents].has(child)) {
            child[$parentComponent] = null;
            this[$childComponents].delete(child);
            child._updateModelPath();
        }
    }



    // MODEL

    get model () {
        return (this.modelPath === null) ? undefined : model.getModel(this.modelPath);
    }

    get modelPath () {
        return this[$modelPath];
    }

    updateView () {}

    _updateModelPath () {

        // determine the new model path
        var newModelPath;
        const modelAttr = this.getAttribute("model") || "";
        if (modelAttr[0] === "/") {
            newModelPath = Path.parse(modelAttr);
        } else if (this.parentComponent) {
            newModelPath = Path.parse(this.parentComponent.modelPath, modelAttr);
        } else {
            newModelPath = null;
        }

        // update the model path and render the view
        const oldModelPath = this.modelPath;
        if (String(newModelPath) !== String(oldModelPath)) {
            this[$modelPath] = newModelPath;
            this.updateView()

            // update the child components model path
            for (let child of this.childComponents) {
                child._updateModelPath();
            }
        }
    }



    // SERVICE METHODS

    dispatch (eventName, eventDetail) {
        this.dispatchEvent(new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            detail: eventDetail
        }));
    }

    $ (selector) {
        return this.shadowRoot.querySelector(selector);
    }
}



module.exports = OloComponent.register('olo-component');
