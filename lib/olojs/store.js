

const Path = require("path");
const Document = require("./document");

const globals = require("./globals");


class Store {
    
    constructor (rootPath="") {
        this.rootPath = rootPath;
    }
    
    resolvePath (path) {
        return this.rootPath + Path.join("/", path);  
    }
    
    createDocument (path, source) {
        const store = this;
        const Document = this.constructor.Document;
        
        const docContext = Object.create(globals);
        docContext.import = async function (subPath) {
            const docPath = Path.resolve("/", path, "..", subPath);
            const doc = await store.readDocument(docPath);
            return doc.data;
        } 
        const doc = new Document(docContext);
        
        doc.load(source);
        doc.data = Object(doc.data);
        
        return doc;
    }
    
    async readDocument (path) {
        throw new Error("Document reader not defined");
    }
    
    async writeDocument (path, doc) {
        throw new Error("Document writer not defined");
    }
    
    static get Document () {
        return Document;
    }
}



module.exports = Store;
