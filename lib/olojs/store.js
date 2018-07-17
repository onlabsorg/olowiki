const engine = require("./engine");
const defaultEngineType = "expression";


class Store {
    
    createDocument (docData) {
        return new this.constructor.Document(docData);
    }
    
    async readDocument (docLocation, user) {}
    
    async writeDocument (docLoaction, doc, user) {}    
    
    static get Document () {
        return Document;
    }
}


class Document {

    constructor (objData={}) {
        this.title = String(objData.title);
        this.author = String(objData.author);
        this.public = Boolean(objData.public);
        this.type = String(objData.type);
        this.context = Object(objData.context);
        this.template = String(objData.template);
    }
    
    async render (customContext) {
        const docEngine = await engine.load(this.type);
        const context = Object.create(this.context);
        for (let key in customContext) context[key] = customContext[key];
        return await docEngine.renderTemplate(this.template, context);
    }
    
    toJSON () {
        return {
            title: this.title,
            author: this.author,
            public: this.public,
            type: this.type,
            context: this.context,
            template: this.template
        }
    }
}



module.exports = Store;
