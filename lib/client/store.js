

const HTTPStore = require("../olojs/stores/http-store-client");

const URL = require("url");
const stripIndent = require("strip-indent");

const newDocumentContent = require("./templates/new-document.yaml");
const errorDocumentContent = require("./templates/error.yaml");


class Store extends HTTPStore {
    
    createDocument (path, content, user) {
        const url = this._getDocURL(path);
        const doc = super.createDocument(url, content, user);
        doc.load = subPath => this.readDocument(URL.resolve(url, subPath), user);
        doc.save = () => this.writeDocument(url, doc, user);
        return doc;
    }
    
    async readDocument (path, user) {
        const url = this._getDocURL(path);
        return await super.readDocument(url, user);
    }
    
    async writeDocument (path, doc, user) {
        const url = this._getDocURL(path);
        await super.writeDocument(url, doc, user);        
    }
    
    createEmptyDocument (path, author) {
        const url = this._getDocURL(path);
        const newDoc = this.createDocument(url, newDocumentContent, author);
        newDoc.assign({author:author});
        return newDoc;
    }
    
    createErrorDocument (path, error) {
        const url = this._getDocURL(path);
        const errorDoc = this.createDocument(url, errorDocumentContent);
        errorDoc.assign({message: error.message});
        return errorDoc;
    }
    
    _getDocURL (path) {
        return URL.resolve(location.href, path);
    }
}


module.exports = Store;
