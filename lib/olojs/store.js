
const Document = require("./document");


class Store {
    
    createDocument (url, content) {
        return new this.constructor.Document(this, url, content);
    }
    
    async readDocument (docLocation, user) {}
    
    async writeDocument (docLoaction, doc, user) {}    
    
    static get Document () {
        return Document;
    }
}


module.exports = Store;
