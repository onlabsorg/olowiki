
const Document = require("./document");
const URL = require("url");


class Store {
    
    createDocument (url, source, user) {
        return new this.constructor.Document(source);
    }
    
    async readDocument (docLocation, user) {}
    
    async writeDocument (docLoaction, doc, user) {}    
    
    static get Document () {
        return Document;
    }
}


module.exports = Store;
