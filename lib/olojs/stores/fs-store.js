const Store = require("../store");
const Document = require("../document");

const Path = require("path");
const fs = require("fs");



class FSStore extends Store {
    
    constructor (rootPath, options) {
        super();
        this.rootPath = rootPath;
    }
    
    async readDocument (path, userId) {
        
        if (!this._fileExists(path)) {
            throw new Store.DocumentNotFoundError();
        }
        
        const xml = await this._readFile(path);
        return new Document(xml);            
    }
    
    async writeDocument (path, doc, userId) {
        
        if (!userId || userId === "undefined") {
            throw new Store.WriteAccessDeniedError();
        }
        
        if (this._fileExists(path)) {
            let oldDoc = await this.readDocument(path);
            if (userId !== oldDoc.author) {
                throw new Store.WriteAccessDeniedError();
            }
        }
        
        doc.author = userId;
        await this._writeFile(path, String(doc));            
    }
    
    _getFullPath (path) {
        return Path.join(this.rootPath, path);
    }
    
    _fileExists (path) {
        const fullPath = this._getFullPath(path);
        return fs.existsSync(fullPath);        
    }
    
    _readFile (path) {
        const fullPath = this._getFullPath(path);
        return new Promise((resolve, reject) => {
            fs.readFile(fullPath, {encoding:'utf8'}, (err, content) => {
                if (err) reject(err);
                else resolve(content);
            });        
        });
    }
    
    _writeFile (path, content) {
        const fullPath = this._getFullPath(path);
        return new Promise((resolve, reject) => {
            fs.writeFile(fullPath, content, {encoding:'utf8'}, (err) => {
                if (err) reject(err);
                else resolve();
            });            
        });        
    }
}

module.exports = FSStore;
