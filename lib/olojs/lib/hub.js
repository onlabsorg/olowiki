
const URL = require("url").URL;

const Document = require("./document");

const Context = require("./context");
const DEFAULT_CONTEXT = new Context();

const MemoryStore = require("./memory-store");
const memoryStore = new MemoryStore();

const errors = require("./errors");


class Hub {
    
    constructor (context=DEFAULT_CONTEXT) {
        this._context = context;
        this._stores = new Map();
        this.addStore("memory://", memoryStore);
    }
    
    async read (url) {
        const purl = this._parseURL(url);
        if (!purl.store) throw new errors.UnknownStoreError(purl.storeURL);
        
        const source = await purl.store.read(purl.docPath);
        if (source === null) return null;
        
        return new Document(source, this._context);
    }
    
    async write (url, doc) {
        const purl = this._parseURL(url);
        if (!purl.store) throw new errors.UnknownStoreError(purl.storeURL);
        
        await purl.store.write(purl.docPath, String(doc));
    }
    
    async delete (url) {
        const purl = this._parseURL(url);        
        if (!purl.store) throw new errors.UnknownStoreError(purl.storeURL);
        
        await purl.store.delete(purl.docPath);        
    }
    
    addStore (storeURL, store) {
        this._stores.set(storeURL, store);
    }
    
    _parseURL (url) {
        const purl = new URL(url);
        const storeURL = `${purl.protocol}//${purl.host}`;
        return {
            storeURL: storeURL,
            store: this._stores.get(storeURL) || null,
            docPath: purl.path,
        }
    }
}


module.exports = Hub;
