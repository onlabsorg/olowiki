
const oloml = require("../oloml");
const oloxp = require("../oloxp");

class Template extends oloml.ScalarType {
    
    async evaluate (self, ...args) {
        
        const expressions = [];
        var text = this.data.replace(/\{\{(.+?)\}\}/gm, (match, expr) => {
            let i = expressions.length;
            expressions.push(expr);
            return `{{${i}}}`;
        });       
        
        const xpContext = oloxp.Context(this.context, self, ...args);
        for (let i=0; i<expressions.length; i++) {
            let expression = expressions[i];
            let value = await oloxp.evaluate(expression, xpContext);
            text = text.replace(`{{${i}}}`, value);
        }
        
        return text;
    }    
}


module.exports = Template;
