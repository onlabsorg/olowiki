
const errors = require("./errors");


class Store {
    
    constructor () {
        this._map = new Map();
    }
    
    async read (path) {
        if (!this._map.has(path)) throw new errors.DocumentNotFound(path);
        return this._map.get(path);
    }
    
    async write (path, source) {
        this._map.set(path, source);
    }
    
    async delete (path) {
        this._map.delete(path);
    }
}

module.exports = Store;
