const engine = require("./engine");
const defaultEngineType = "expression";

const cloneDeep = require("lodash/cloneDeep");
const assignIn = require("lodash/assignIn");

const URL = require("url");



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


class Document {

    constructor (store, url, docData={}) {
        this.store = store;
        this.url = url;
        assignDocData(this, docData);
    }
    
    async render (context, user) {
        const docEngine = await engine.load(this.doctype);        
        assignIn(context, this.context);
        assignIn(context, await this._loadReferences(user));
        return await docEngine.renderTemplate(this.template, context);
    }
    
    toJSON () {
        return assignDocData({}, this);
    }
    
    async _loadReferences (user) {
        const refContexts = {}
        for (let refName in this.references) {
            let refURL = URL.resolve(this.url, this.references[refName]);
            let refDoc = await this.store.readDocument(refURL, user);
            let refDocContext = {};
            let refHTML = await refDoc.render(refDocContext, user);
            refContexts[refName] = refDocContext;
        }
        return refContexts;
    }
}



function assignDocData (dest, origin) {
    dest.title = String(origin.title);
    dest.author = String(origin.author);
    dest.public = Boolean(origin.public);
    dest.doctype = String(origin.doctype);
    dest.context = Object(origin.context);
    dest.references = Object(origin.references);
    dest.template = String(origin.template);    
    return dest;
}



module.exports = Store;
