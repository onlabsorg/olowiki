const fs = require("fs");
const Path = require('path');
const errors = require('olojs/lib/errors');


class FSBackend {
    
    constructor (rootPath, extension="olo") {
        this.rootPath = Path.normalize(rootPath);
        this._extension = extension[0] === "." ? extension : "." + extension;
    }
    
    async read (path) {
        const fullPath = this._resolvePath(path);
        if (!this._fileExists(fullPath)) throw new errors.DocumentNotFound(path);
        const fileContent = await this._readFile(fullPath);
        return fileContent;        
    }
    
    async write (path, content) {
        const fullPath = this._resolvePath(path);
        await this._createPath( Path.dirname(fullPath) );
        await this._writeFile(fullPath, String(content));        
    }
    
    async delete (path) {
        const fullPath = this._resolvePath(path);
        if (!this._fileExists(fullPath)) return;
        await this._deleteFile(fullPath);           
    }
    
    _resolvePath (path) {
        return Path.join(this.rootPath, Path.join("/", path) + this._extension);  
    }
    
    _fileExists (fullPath) {
        return fs.existsSync(fullPath);        
    }
    
    _readFile (fullPath) {
        return new Promise((resolve, reject) => {
            fs.readFile(fullPath, {encoding:'utf8'}, (err, content) => {
                if (err) reject(err);
                else resolve(content);
            });                        
        });
    }
    
    _writeFile (fullPath, content) {
        return new Promise((resolve, reject) => {
            fs.writeFile(fullPath, content, {encoding:'utf8'}, (err) => {
                if (err) reject(err);
                else resolve();
            });            
        });        
    }
    
    _deleteFile (fullPath) {
        return new Promise((resolve, reject) => {
            fs.unlink(fullPath, (err) => {
                if (err) reject(err);
                else resolve();
            });            
        });                
    }    
    
    _createPath (fullPath) {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(fullPath)) resolve();
            else fs.mkdir(fullPath, { recursive: true }, (err) => {
                if (err) reject(err);
                else resolve();
            });                    
        });
    }
}

module.exports = FSBackend;
