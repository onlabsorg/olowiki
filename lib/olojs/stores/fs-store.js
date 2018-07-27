const Store = require("../store");
const errors = require("../errors");

const Path = require("path");
const fs = require("fs");



class FSStore extends Store {
    
    constructor (rootPath, options) {
        super();
        this.rootPath = rootPath;
    }
    
    createDocument (path, content) {
        const fullPath = this._getFullPath(path);
        return super.createDocument(fullPath, content);
    }
    
    async readDocument (path, userId) {  
        if (!this._fileExists(path)) {
            throw new errors.DocumentNotFoundError();
        }
        
        const fileContent = await this._readFile(path);
        const doc = this.createDocument(path, fileContent);
        
        if (!doc.public && userId !== doc.author) {
            throw new errors.ReadAccessDeniedError();
        }
        
        return doc;
    }
    
    async writeDocument (path, doc, userId) {
        
        if (!userId || userId === "undefined") {
            throw new errors.WriteAccessDeniedError();
        }
        
        if (this._fileExists(path)) {
            let oldDoc = await this.readDocument(path, userId);
            if (userId !== oldDoc.author) {
                throw new errors.WriteAccessDeniedError();
            }
        }
        
        doc.author = userId;
        
        await this._writeFile(path, String(doc));
    }
    
    _getFullPath (path) {
        return Path.join(this.rootPath, path) + ".yaml";
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
    
    _deleteFile (path) {
        const fullPath = this._getFullPath(path);
        return new Promise((resolve, reject) => {
            fs.unlink(fullPath, (err) => {
                if (err) reject(err);
                else resolve();
            });            
        });                
    }
}

module.exports = FSStore;
