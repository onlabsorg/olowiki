
const HTTPStore = require("../olojs/stores/http-store-client");


class Store extends HTTPStore {
    
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
