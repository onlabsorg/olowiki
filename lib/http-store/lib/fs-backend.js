const Path = require('path');
const fs = require("fs");
const mkdirp = require("mkdirp");
const rimraf = require("rimraf");
const errors = require('olojs/lib/errors');


const FILE_EXTENSION = ".olo";
const EMPTY_RESOURCE = "";


class FSBackend {
    
    constructor (rootPath) {
        this.rootPath = Path.normalize(rootPath);
    }
    
    read (path) {
        return new Promise((resolve, reject) => {
            const fullPath = this._resolvePath(path);

            if (matchDirPath(path)) {
                fs.readdir(fullPath, (err, files) => {
                    var items = [];
                    if (!err) {
                        for (let name of files) {
                            const stat = fs.lstatSync(fullPath+name);
                            if (stat.isDirectory()) {
                                items.push(`${name}/`);
                            } else if (stat.isFile() && matchDocumentName(name)) {    
                                items.push( name.slice(0, -FILE_EXTENSION.length) );
                            }
                        }
                    }
                    resolve(`<% items = ${JSON.stringify(items)} %>`);
                });
            }
            
            else {
                if (!fs.existsSync(fullPath)) resolve("");
                else fs.readFile(fullPath, {encoding:'utf8'}, (err, content) => {
                    if (err) reject(err);
                    else resolve(content);
                });                        
            }
        });                  
        
        
    }
    
    write (path, content) {
        if (matchDirPath(path)) {
            throw new errors.WriteOperationNotAllowed(path);
        }
        
        const parentPath = Path.join("/", path, "..") + "/";
        const fullParentPath = this._resolvePath(parentPath);
        if (!fs.existsSync(fullParentPath)) {
            mkdirp.sync(fullParentPath);
        }
        
        const fullPath = this._resolvePath(path);
        return new Promise((resolve, reject) => {
            fs.writeFile(fullPath, content, {encoding:'utf8'}, (err) => {
                if (err) reject(err);
                else resolve();
            });            
        });                
    }
    
    delete (path) {
        const fullPath = this._resolvePath(path);
        if (!fs.existsSync(fullPath)) return;

        return new Promise((resolve, reject) => {
            rimraf(fullPath, (err) => {
                if (err) reject(err);
                else resolve();
            });            
        });                        
    }
    
    _resolvePath (path) {
        if (matchDirPath(path)) {
            return Path.join(this.rootPath, Path.join("/", path));
        } else {
            return Path.join(this.rootPath, Path.join("/", path)) + FILE_EXTENSION;            
        }
    }
}


function matchDirPath (path) {
    return path.substr(-1) === "/";
}

function matchDocumentName (name) {
    return name.slice(-FILE_EXTENSION.length) === FILE_EXTENSION;
}


module.exports = FSBackend;
