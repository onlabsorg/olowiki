const Store = require("../store");
const Document = require("../document");

const Path = require("path");
const fs = require("fs");



class FSStore extends Store {
    
    constructor (rootPath, options) {
        super();
        this.rootPath = rootPath;
    }
    
    async getDocument (path, userId) {
        
        if (this._fileExists(path)) {
            let html = await this._readFile(path);
            return Document.parse(html);            
        } 
        
        else {
            return new Document({
                title: "New document",
                author: userId,
                template: "This document doesn't exist yet.<br>Edit and save it to create it."                
            });
        }
    }
    
    async setDocument (path, doc, userId) {
        const oldDoc = await this.getDocument(path);
        if (!oldDoc.author || oldDoc.author === "undefined" || oldDoc.author === userId) {
            await this._writeFile(path, doc.toHTML());            
        }
        else {
            throw new Error("Write access denied");
        }
        
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
