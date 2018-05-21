
const mustache = require("mustache");
const fs = require("fs");
const docTemplate = fs.readFileSync(`${__dirname}/fs-store.document.mustache`, {encoding: 'utf8'});
const JSDOM = require("jsdom").JSDOM;

const jwt = require("jsonwebtoken");


class Store {
    
    constructor (rootPath, options) {
        this.rootPath = rootPath;
        this.jwtKey = options.jwtKey;
    }
    
    getFullPath (path) {
        return path[0] === "/" ? this.rootPath + path : `${this.rootPath}/${path}`;
    }
    
    renderDocument (docData) {
        return mustache.render(docTemplate, docData);
    }
    
    renderEmptyDocument (author) {
        return this.renderDocument({
            title: "New document",
            author: author,
            sections: [
                {
                    name: "section1",
                    title: "New Section",
                    display: {
                        collapsed: false,
                        hidden: false
                    },
                    template: "This document doesn't exist yet.<br>You can create it by editing it and saving it."
                }
            ]
        });
    }
    
    async writeDocument (path, docData) {
        const docHTML = this.renderDocument(docData);
        await this._writeFile(path, docHTML);
    }
    
    async readDocumentData (path) {
        const html = await this._readFile(path);
        const dom = new JSDOM(html);
        const head = dom.window.document.querySelector("head");
        const metaNodes = head.querySelectorAll('meta');

        const info = {}
        try {                
            for (let metaNode of metaNodes) {
                let key = metaNode.getAttribute('name');
                let value = metaNode.getAttribute('content');
                info[key] = value;
            }
        } catch (err) {console.log(err)};
        
        return info;
    }
    
    verifyToken (token) {
        return jwt.verify(token, this.jwtKey);
    }
    
    generateToken (payload) {
        return jwt.sign(payload, this.jwtKey);
    }
    
    _fileExists (path) {
        const fullPath = this.getFullPath(path);
        return fs.existsSync(fullPath);        
    }
    
    _readFile (path) {
        const fullPath = this.getFullPath(path);
        return new Promise((resolve, reject) => {
            fs.readFile(fullPath, {encoding:'utf8'}, (err, content) => {
                if (err) reject(err);
                else resolve(content);
            });        
        });
    }
    
    _writeFile (path, content) {
        const fullPath = this.getFullPath(path);
        return new Promise((resolve, reject) => {
            fs.writeFile(fullPath, content, {encoding:'utf8'}, (err) => {
                if (err) reject(err);
                else resolve();
            });            
        });        
    }
}

module.exports = Store;
