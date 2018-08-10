
const YAML = require("js-yaml");


 class Composition {
    
    constructor (source, doc) {
        this.source = source;
        this.doc = doc;
    }
    
    async call (scope, ...args) {
        const context = Object.create(this.doc.parse());
        context.$0 = scope;
        for (let i=0; i<args.length; i++) {
            context[`$${i+1}`] = args[i];
        }        

        var text = "";
        for (let item of this.source) {
            if (typeof item.call === "function") {
                text += await item.call(scope, ...args)
            } else {
                text += String(item);
            }
        }
        
        return text;
    }
    
    toString () {
        var text = "";
        for (let item of this.source) {
            text += String(item);
        }
        return text;        
    }
    
    static createYAMLType (tagName, doc) {
        return new YAML.Type(tagName, {
            
            kind: 'sequence',
            
            resolve: data => data !== null,
            
            construct: data => new this(data, doc),
            
            instanceOf: this,
            
            represent: template => template.source
        });
    }
}


module.exports = Composition;
