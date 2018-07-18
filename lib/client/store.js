
const HTTPStore = require("../olojs/stores/http-store-client");
const URL = require("url");


class Store extends HTTPStore {
    
    async readDocument (path, user) {
        const url = URL.resolve(location.href, path);
        return await super.readDocument(url, user);
    }
    
    createEmptyDocument (author) {
        return this.createDocument({
            title: "New document",
            author: author,
            template: `
                <h1>Not found!</h1>
                This document doesn't exist, but you can create it by just editing and saving it.
            `
        });
    }
    
    createErrorDocument (error) {
        return this.createDocument({
            title: "Error",
            template: String(error)
        });
    }
}

module.exports = Store;
