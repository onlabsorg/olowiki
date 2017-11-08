const model = require("model");

const $parentComponent = Symbol("olo-component.$parentComponent");
const $childComponents = Symbol("olo-component.$childComponents");
const $model = Symbol("olo-component.$model");
const $modelChangeCallback = Symbol("olo-component.$modelChangeCallback");


class OloComponent extends HTMLElement {

    static get template () {
        return "<slot></slot>";
    }

    static get observedAttributes () {
        return ['model'];
    }

    static get config () {
        return model.config;
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

        this[$model] = null;
        this[$modelChangeCallback] = () => this.updateView();

        this.shadowRoot.innerHTML = this.constructor.template;
    }

    connectedCallback () {
        this.dispatch("olo-component-connected", this);
    }

    attributeChangedCallback (attrName, oldVal, newVal) {
        if (attrName === "model") this._updateModel();
    }

    disconnectedCallback () {
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
        child._updateModel();
    }

    _unregisterChild (child) {
        if (this[$childComponents].has(child)) {
            child[$parentComponent] = null;
            this[$childComponents].delete(child);
            child._updateModel();
        }
    }



    // MODEL

    get model () {
        return this[$model];
    }

    updateView () {}

    _updateModel () {

        // determine the new model
        const rootModel = this.constructor.config.rootModel;
        const refModel = this.parentComponent ? this.parentComponent.model || rootModel : rootModel;
        const newModelPath = refModel.path + "/" + (this.getAttribute("model") || "");
        const newModel = rootModel.getNode(newModelPath);

        // update the model and renders it
        const oldModel = this.model;
        if (newModel !== oldModel) {

            // unbind the old model
            if (oldModel !== null) oldModel.afterChangeCallbacks.delete(this[$modelChangeCallback]);

            // bind the new model
            if (newModel !== null) newModel.afterChangeCallbacks.add(this[$modelChangeCallback]);
            this[$model] = newModel;

            // update the view
            this.updateView()

            // update the child components model
            for (let child of this.childComponents) {
                child._updateModel();
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

OloComponent.config.rootModel = new model.Document({name:"root"});

module.exports = OloComponent.register('olo-component');
