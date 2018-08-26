
const oloml = require("../oloml");
const oloxp = require("../oloxp");

class Template extends oloml.ScalarType {
    
    async evaluate (scope, ...args) {
        
        const expressions = [];
        var text = this.data.replace(/\{\{(.+?)\}\}/gm, (match, expr) => {
            let i = expressions.length;
            expressions.push(expr);
            return `{{${i}}}`;
        });       
        
        const context = this.options.Context(scope, ...args);
        for (let i=0; i<expressions.length; i++) {
            let expression = expressions[i];
            let value;
            try {
                value = await oloxp.evaluate(expression, context);
            } catch (error) {
                value = this.options.onError(error);
            }            
            text = text.replace(`{{${i}}}`, value);
        }
        
        return text;
    }    
}


module.exports = Template;
