
const YAML = require("js-yaml");
const oloxp = require("../oloxp");


 class Template {
    
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
        
        const expressions = [];
        var text = this.source.replace(/\{\{(.+?)\}\}/gm, (match, expr) => {
            let i = expressions.length;
            expressions.push(expr);
            return `{{${i}}}`;
        });       
        for (let i=0; i<expressions.length; i++) {
            let expression = expressions[i];
            let value;
            try {
                value = await oloxp.evaluate(expression, context);
            } catch (error) {
                value = this.renderError(error);
            }            
            text = text.replace(`{{${i}}}`, value);
        }
        return text;
    }
    
    renderError (error) {
        return `<span class="error">ERROR:[[${error}]]</span>`;        
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
            
            represent: template => String(template)
        });
    }
}


module.exports = Template;
