

const HTTPStore = require("../olojs/stores/http-store-client");

const URL = require("url");
const stripIndent = require("strip-indent");


class Store extends HTTPStore {
    
    createDocument (path, content) {
        const url = this._getDocURL(path);
        return super.createDocument(url, content);
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
        return this.createDocument(url, {
            title: "New document",
            author: author,
            template: stripIndent(`
                <h1>Not found!</h1>
                This document doesn't exist, but you can create it by just editing and saving it.
                `)
        });
    }
    
    createErrorDocument (path, error) {
        const url = this._getDocURL(path);
        return this.createDocument(url, {
            title: "Error",
            template: String(error)
        });
    }
    
    _getDocURL (path) {
        return URL.resolve(location.href, path);
    }
}

module.exports = Store;
