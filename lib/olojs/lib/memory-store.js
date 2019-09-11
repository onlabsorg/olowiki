/**
 *  # olojs.memory-store module
 *
 *  This module exports the `MemoryStore` class.
 *
 *  - License: MIT
 *  - Author: Marcello Del Buono <m.delbuono@onlabs.org>
 */


 const Path = require("path");
 const errors = require("./errors");



/**
 *  ## olojs.MemoryStore class
 *
 *  The `MemoryStore` class implement an in-memory olojs store interface.
 */
class MemoryStore {
    
    constructor () {
        this._docs = new Map();
    }
    
    
    async read (path) {
        path = Path.join("/", path);
        
        if (path.slice("-1") === "/") {
            let items = this._readContainer(path) || [];
            return `<% items = ${JSON.stringify(items)} %>`;
        } else {
            return this._readDocument(path) || "";
        }
    }
    
    async write (path, content) {
        path = Path.join("/", path);
        
        if (path.slice(-1) === "/") {
            throw new errors.WriteOperationNotAllowed(path);
        } else {
            this._writeDocument(path, String(content));
        }
    }
    
    async delete (path) {
        path = Path.join("/", path);        
        
        if (path.slice(-1) === "/") {
            this._deleteContainer(path);
        } else {
            this._deleteDocument(path);
        }
    }
    
            
    _readDocument (path) {        
        return this._docs.get(path) || "";
    }


    _readContainer (path) {
        if (path === "/") return this._getRootItems();

        if (path.slice(-1) !== "/") path += "/";
        const items = [];
        for (let fullPath of this._docs.keys()) {
            if (fullPath.indexOf(path) === 0) {
                let subPath = fullPath.slice(path.length);
                let slashIndex = subPath.indexOf("/");
                if (slashIndex === -1) {
                    items.push( subPath );
                } else {
                    items.push( subPath.slice(0, slashIndex+1) )
                }
            }
        }
        return items;
    }
    
    _getRootItems () {
        const items = [];
        for (let path of this._docs.keys()) {
            let names = path.split("/");
            let rootName = names[1] + (names.length > 2 ? "/" : "");
            if (items.indexOf(rootName) === -1) items.push(rootName);
        }   
        return items;     
    }
    
    _writeDocument (path, content) {
        this._docs.set(path, content);            
    }
    
        
    _deleteDocument (path) {
        this._docs.delete(path);            
    }
    
    _deleteContainer (path) {
        for (let docPath of this._docs.keys()) {
            if (docPath.indexOf(path) === 0) {
                this._docs.delete(docPath);
            }
        }
    }
}


// Exports
module.exports = MemoryStore;
