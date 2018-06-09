
class Store {
    
    async getDocument (docLocation, user) {}
    
    async setDocument (docLoaction, doc, user) {}    
}

Store.DocumentNotFoundError = class extends Error {
    constructor () {
        super("Document not found.");
    }
}

Store.WriteAccessDeniedError = class extends Error {
    constructor () {
        super("Write access denied.");
    }
}

module.exports = Store;
