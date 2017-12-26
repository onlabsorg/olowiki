
const Path = require("olojs/path");
const Document = require("olojs/document");

const Model = require("model");
Model.root = new Model(new Document({ committed: { data: {} } }), "/");

const OloElement = require("olo-element");



class OloComponent extends OloElement {

    static get template () {
        return "<slot></slot>";
    }

    static get observedAttributes () {
        return ['model'];
    }



    // LIFE CYCLE

    constructor () {
        super();

        this._parentComponent = null;
        this._childComponents = new Set();
        this.addEventListener("olo-component-connected", (event) => {
            if (event.detail !== this) {
                this._registerChild(event.detail);
                event.stopPropagation();
            }
        });

        this._parentModel = null;
        this._model = null;
        this._modelSubscription = null;

        this.shadowRoot.innerHTML = this.constructor.template;
    }

    connectedCallback () {
        this.dispatch("olo-component-connected", this);
    }

    modelAttributeChangedCallback (oldVal, newVal) {
        this._updateModel();
    }

    disconnectedCallback () {
        if (this.parentComponent) {
            this.parentComponent._unregisterChild(this);
        }
    }



    // CHILD COMPONENTS

    get parentComponent () {
        return this._parentComponent;
    }

    get childComponents () {
        return (function * () {
            for (let childComponent of this._childComponents) yield childComponent;
        }).call(this);
    }

    _registerChild (child) {
        child._parentComponent = this;
        this._childComponents.add(child);
        child._updateModel();
    }

    _unregisterChild (child) {
        if (this._childComponents.has(child)) {
            child._parentComponent = null;
            this._childComponents.delete(child);
            child._updateModel();
        }
    }



    // MODEL

    get parentModel () {
        if (this._parentModel) return this._parentModel;
        if (this.parentComponent) return this.parentComponent.model || this.parentComponent.parentModel;
        return Model.root;
    }

    set parentModel (newParentModel) {
        if (newParentModel instanceof Model || newParentModel === null) {
            this._parentModel = newParentModel;
            this._updateModel();
        }
    }

    get model () {
        return this._model;
    }

    updateView (changes) {}

    _updateModel () {

        // determine the new model
        const modelAttr = this.getAttribute("model") || "";
        const newModel = (modelAttr[0] === "/") ?
                new Model(this.parentModel.document, modelAttr) :
                this.parentModel.getSubModel(modelAttr);

        // update the model path and render the view
        const oldModel = this.model;
        if (oldModel === null || newModel.document !== oldModel.document || String(newModel.path) !== String(oldModel.path)) {

            if (this._modelSubscription) this._modelSubscription.cancel();
            this._modelSubscription = newModel.subscribe(changes => this.updateView(changes));

            this._model = newModel;
            this.updateView()

            // update the child components model path
            for (let child of this.childComponents) {
                child._updateModel();
            }
        }
    }
}



module.exports = OloComponent.register('olo-component');
