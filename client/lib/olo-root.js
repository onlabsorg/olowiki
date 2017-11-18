const store = require("store");
const OloComponent = require("olo-component");


class OloRoot extends OloComponent {

    constructor () {
        super();
        this.document = new store.Document();
    }

    get document () {
        return this._document;
    }

    set document (doc) {
        if (doc instanceof store.Document) {
            this._document = doc;
            this._updateModel();
        }
    }

    _getRefModel () {
        return this.document;
    }
}

module.exports = OloRoot.register("olo-root");
