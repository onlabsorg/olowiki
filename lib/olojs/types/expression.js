const YAML = require("js-yaml");
const oloxp = require("../oloxp");


class Expression {
    
    constructor (source, doc) {
        this.source = String(source);
        this.doc = doc;
    }
    
    async call (scope, ...args) {
        const context = Object.create(this.doc.parse());
        context.$0 = scope;
        for (let i=0; i<args.length; i++) {
            context[`$${i+1}`] = args[i];
        }
        return await oloxp.evaluate(this.source, context);
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
            
            represent: expression => String(expression)
        });
    }
}


module.exports = Expression;
