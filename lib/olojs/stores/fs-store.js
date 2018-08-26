const Store = require("../store");
const errors = require("../errors");

const Path = require("path");
const fs = require("fs");



class FSStore extends Store {
    
    createDocument (path, content) {
        const fullPath = this.resolvePath(path);
        return super.createDocument(fullPath, content);
    }
    
    async readDocument (path) {  
        if (!this._fileExists(path)) return null;
        const fileContent = await this._readFile(path);
        return this.createDocument(path, fileContent);
    }
    
    async writeDocument (path, doc) {
        await this._writeFile(path, String(doc));
    }
    
    resolvePath (path) {
        return super.resolvePath(path) + ".yaml";
    }
    
    _fileExists (path) {
        const fullPath = this.resolvePath(path);
        return fs.existsSync(fullPath);        
    }
    
    _readFile (path) {
        const fullPath = this.resolvePath(path);
        return new Promise((resolve, reject) => {
            fs.readFile(fullPath, {encoding:'utf8'}, (err, content) => {
                if (err) reject(err);
                else resolve(content);
            });        
        });
    }
    
    _writeFile (path, content) {
        const fullPath = this.resolvePath(path);
        return new Promise((resolve, reject) => {
            fs.writeFile(fullPath, content, {encoding:'utf8'}, (err) => {
                if (err) reject(err);
                else resolve();
            });            
        });        
    }
    
    _deleteFile (path) {
        const fullPath = this.resolvePath(path);
        return new Promise((resolve, reject) => {
            fs.unlink(fullPath, (err) => {
                if (err) reject(err);
                else resolve();
            });            
        });                
    }
}

module.exports = FSStore;
