const YAML = require("js-yaml");


class Link {
    
    constructor (source, doc) {
        this.source = String(source);
        this.doc = doc;
    }
    
    async call (scope, ...args) {
        const context = Object.create(this.doc.data);
        context.$0 = scope;
        for (let i=0; i<args.length; i++) {
            context[`$${i+1}`] = args[i];
        }
        const linkedDoc = await this.doc.load(this.source);
        return linkedDoc.data;
    }
    
    toString () {
        return this.source;
    }
    
    static createYAMLType (tagName, doc) {
        return new YAML.Type(tagName, {
            
            kind: 'scalar',
            
            resolve: data => data !== null,
            
            construct: data => new this(data, doc),
            
            instanceOf: this,
            
            represent: link => String(link)
        });
    }
}

module.exports = Link;
