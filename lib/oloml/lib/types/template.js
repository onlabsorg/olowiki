
const parser = require("../parser");
const oloxp = require("oloxp");

class Template extends parser.ScalarType {
    
    async call (context, ...args) {
        
        context = Object.create(context);
        context.args = args;
        
        const expressions = [];
        var text = this.data.replace(/\{\{(.+?)\}\}/gm, (match, expr) => {
            let i = expressions.length;
            expressions.push(expr);
            return `{{${i}}}`;
        });       
        
        for (let i=0; i<expressions.length; i++) {
            let expr = expressions[i];
            let value = await oloxp.evaluate(expr, context);
            text = text.replace(`{{${i}}}`, value);
        }
        
        return text;
    }    
}


module.exports = Template;
