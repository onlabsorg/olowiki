
class Store {
    
    async readDocument (docLocation, user) {}
    
    async writeDocument (docLoaction, doc, user) {}    
}

Store.DocumentNotFoundError = class extends Error {
    constructor () {
        super("Document not found.");
    }
}

Store.ReadAccessDeniedError = class extends Error {
    constructor () {
        super("Read access denied.");
    }
}

Store.WriteAccessDeniedError = class extends Error {
    constructor () {
        super("Write access denied.");
    }
}

module.exports = Store;
