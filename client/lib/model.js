
const Path = require("olojs/path");
const Change = require("olojs/change");
const Document = require("olojs/document");



class Model {

    constructor (doc, path) {
        if (doc instanceof Document) {
            this.document = doc;
            this.path = Path.parse(path);
        } else {
            throw new Error("olojs Document instance expected as first argument");
        }
    }

    _getFullPath (subPath) {
        return Path.parse(this.path, subPath);
    }

    type (subPath) {
        const fullPath = this._getFullPath(subPath);
        return this.document.type(fullPath);
    }

    get (subPath) {
        const fullPath = this._getFullPath(subPath);
        return this.document.get(fullPath);
    }

    applyChanges (...subChanges) {
        const changes = subChanges.map(change => new Change(this._getFullPath(change.path), change.value, change.timestamp));
        this.document.applyChanges(...changes);
    }

    set (subPath, value) {
        const fullPath = this._getFullPath(subPath);
        this.document.set(fullPath, value);
    }

    delete (subPath) {
        const fullPath = this._getFullPath(subPath);
        this.document.delete(fullPath);
    }

    subscribe (callback) {

        const subscription = {
            model: this,
            callback: callback,
            cancel: () => {
                this.document.changeCallbacks.delete(listener);
            }
        }

        const listener = changes => {
            const modelPath = this._getFullPath("/");
            const relevantChanges = changes.map(change => change.getSubChange(modelPath)).filter(change => change !== null);
            if (relevantChanges.length > 0) subscription.callback(relevantChanges);
        }

        this.document.changeCallbacks.add(listener);

        return subscription;
    }

    getSubModel (subPath) {
        const subModelPath = Path.parse(this.path, subPath);
        return new this.constructor(this.document, subModelPath);
    }
}


module.exports = Model;
