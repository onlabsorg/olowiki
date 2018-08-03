
const YAML = require("js-yaml");


 class Template {
    
    constructor (source, doc) {
        this.source = source;
        this.doc = doc;
    }
    
    async call (scope, ...args) {
        const context = Object.create(this.doc.data);
        context.$0 = scope;
        for (let i=0; i<args.length; i++) {
            context[`$${i+1}`] = args[i];
        }        

        var text = "";
        for (let item of this.source) {
            if (typeof item.call === "function") {
                text += await item.call(scope, ...args)
            } else {
                // ignore what is not a callable. This can be used to comment.
            }
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


module.exports = Template;
