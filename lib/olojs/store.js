const engine = require("./engine");
const defaultEngineType = "expression";

const cloneDeep = require("lodash/cloneDeep");
const assignIn = require("lodash/assignIn");



class Store {
    
    createDocument (content) {
        return new this.constructor.Document(this, content);
    }
    
    async readDocument (docLocation, user) {}
    
    async writeDocument (docLoaction, doc, user) {}    
    
    static get Document () {
        return Document;
    }
}


class Document {

    constructor (store, content={}) {
        this.store = store;
        this.title = String(content.title);
        this.author = String(content.author);
        this.public = Boolean(content.public);
        this.doctype = String(content.doctype);
        this.context = Object(content.context);
        this.references = Object(content.references);
        this.template = String(content.template);
    }
    
    async render (context, user) {
        const docEngine = await engine.load(this.doctype);        
        assignIn(context, this.context);
        for (let refName in this.references) {
            let refURL = this.references[refName];
            let refDoc = await this.store.readDocument(refURL, user);
            let refDocContext = {};
            let refHTML = await refDoc.render(refDocContext, user);
            context[refName] = refDocContext;
        }
        return await docEngine.renderTemplate(this.template, context);
    }
    
    toJSON () {
        return {
            title: this.title,
            author: this.author,
            public: this.public,
            doctype: this.doctype,
            context: this.context,
            references: this.references,
            template: this.template
        }
    }
}



module.exports = Store;
