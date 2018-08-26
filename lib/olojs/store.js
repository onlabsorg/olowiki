

const Path = require("path");
const Document = require("./document");

const ExpressionType = require("./oloml-types/expression");
const TemplateType = require("./oloml-types/template");
const LinkType = require("./oloml-types/link");
const MarkdownType = require("./oloml-types/markdown");
const CompositionType = require("./oloml-types/composition");


class Store {
    
    constructor (rootPath="") {
        this.rootPath = rootPath;
    }
    
    resolvePath (path) {
        return this.rootPath + Path.join("/", path);  
    }
    
    createDocument (path, source) {
        const Document = this.constructor.Document;
        const doc = new Document();
        
        doc.registerType("!=", ExpressionType, {
            Context: (scope, ...args) => generateContext(doc, scope, ...args),
            onError: (error) => Document.renderError(error),
        });
        
        doc.registerType("!template", TemplateType, {
            Context: (scope, ...args) => generateContext(doc, scope, ...args),
            onError: (error) => Document.renderError(error),
        });    

        doc.registerType("!markdown", MarkdownType, {
            Context: (scope, ...args) => generateContext(doc, scope, ...args),
            onError: (error) => Document.renderError(error),
        });

        doc.registerType("!composition", CompositionType, {});
            
        doc.registerType("!link", LinkType, {
            store: this,
            path: Path.join("/", path, ".."),
        });
        
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


function generateContext (doc, scope, ...args) {
    const context = Object.create(doc.data);
    context.$0 = scope || doc.data;
    for (let i=0; i<args.length; i++) {
        context[`$${i+1}`] = args[i];
    }        
    return context;
}



module.exports = Store;
