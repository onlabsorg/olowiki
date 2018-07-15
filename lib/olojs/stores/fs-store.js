const Store = require("../store");
const errors = require("../errors");

const Path = require("path");
const fs = require("fs");

const YAML = require("js-yaml");



class FSStore extends Store {
    
    constructor (rootPath, options) {
        super();
        this.rootPath = rootPath;
    }
    
    async readDocument (path, userId) {  
        if (!this._fileExists(path)) {
            throw new errors.DocumentNotFoundError();
        }
        
        const fileContent = await this._readFile(path);
        const docData = YAML.load(fileContent)
        const doc = this.createDocument(docData);
        
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
        
        const docData = doc.toJSON();
        const fileContent = YAML.dump(docData);
        await this._writeFile(path, fileContent);
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
}

module.exports = FSStore;
