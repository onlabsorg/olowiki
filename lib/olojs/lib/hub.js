/**
 *  # olojs.store module
 *
 *  This module exports the `Store` class.
 *
 *  - License: MIT
 *  - Author: Marcello Del Buono <m.delbuono@onlabs.org>
 */


const Document = require("./document");
const defaultContext = require("./context");
const Path = require("path");
const URI = require("./uri");





class Hub {

    constructor (stores, context=defaultContext) {
        this.context = context;
        this._stores = new Map();
        for (let rootURI in stores) {
            this.mount(rootURI, stores[rootURI]);
        }
    }


    mount (rootURI, store) {
        if (rootURI.slice(-1) !== "/") rootURI += "/";
        this._stores.set(rootURI, Object(store));
    }

    unmount (rootURI) {
        this._stores.delete(rootURI);
    }
    
    _parseURI (uri) {
        uri = uri.root + uri.path;
        for (let rootURI of this._stores.keys()) {
            if (uri.indexOf(rootURI) === 0) {
                return {
                    store: this._stores.get(rootURI),
                    path: "/" + uri.slice(rootURI.length)
                }
            }
        }
        return null;
    }    
    
    create (uri, source) {
        if (!(uri instanceof URI)) uri = new URI(uri);
        const docContext = Object.create(this.context);
        docContext.URI = uri.toNamespace();
        docContext.import = relativeURI => this._import(uri, relativeURI);
        const doc = new Document(source, docContext);
        doc.uri = uri;
        return doc;
    }

    async _import (baseURI, relativeURI) {
        const docURI = baseURI.resolve(relativeURI);
        const doc = await this.read(docURI);
        return await doc.evaluate();        
    }
    
    async read (uri) {
        if (!(uri instanceof URI)) uri = new URI(uri);
        const mountPoint = this._parseURI(uri);
        const source = mountPoint ? await mountPoint.store.read(mountPoint.path) : "";
        return this.create(uri, source);
    }
    
    async write (uri, source) {
        if (!(uri instanceof URI)) uri = new URI(uri);
        const mountPoint = this._parseURI(uri);
        if (mountPoint) await mountPoint.store.write(mountPoint.path, String(source));
    }

    async delete (uri) {
        if (!(uri instanceof URI)) uri = new URI(uri);
        const mountPoint = this._parseURI(uri);
        if (mountPoint) await mountPoint.store.delete(mountPoint.path);
    }
}


// Exports
module.exports = Hub;
