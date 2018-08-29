
const oloml = require("../oloml");
const oloxp = require("../oloxp");

class Template extends oloml.ScalarType {
    
    constructor (data, options) {
        super(data, options);
        if (typeof this.options.ContextPrototype !== "function") {
            let contextPrototype = this.options.ContextPrototype;
            this.options.ContextPrototype = () => Object(contextPrototype);
        }
        if (typeof this.options.renderError !== "function") {
            this.options.renderError = error => String(error);
        }
    }    
    
    async evaluate (scope, ...args) {
        
        const expressions = [];
        var text = this.data.replace(/\{\{(.+?)\}\}/gm, (match, expr) => {
            let i = expressions.length;
            expressions.push(expr);
            return `{{${i}}}`;
        });       
        
        const context = this.Context(this.options.ContextPrototype(), scope, ...args);
        for (let i=0; i<expressions.length; i++) {
            let expression = expressions[i];
            let value;
            try {
                value = await oloxp.evaluate(expression, context);
            } catch (error) {
                value = this.options.renderError(error);
            }            
            text = text.replace(`{{${i}}}`, value);
        }
        
        return text;
    }    
}


module.exports = Template;
