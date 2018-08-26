

const HTTPStore = require("../olojs/stores/http-store-client");

const stripIndent = require("strip-indent");

const newDocumentContent = require("./templates/new-document.yaml");
const errorDocumentContent = require("./templates/error.yaml");


class Store extends HTTPStore {
    
    constructor (host="", token=null) {
        const httpAuthorizationHeader = `Bearer ${token}`;
        super(host, httpAuthorizationHeader);
    }
    
    createEmptyDocument (path) {
        return this.createDocument(path, newDocumentContent);
    }
    
    createErrorDocument (path, error) {
        const errorDoc = this.createDocument(path, errorDocumentContent);
        errorDoc.data.message = error.message;
        return errorDoc;
    }    
}


module.exports = Store;
