
const Expression = require("./expression");
const marked = require("marked");

const isObject = (obj) => typeof obj === "object" && obj !== null;


class Context {

    async len (obj) {
                
        if (isObject(obj)) {
            if (typeof obj.__len__ === "function") {
                return Number( await obj.__len__() ) || 0;
            } else {
                return Object.keys(obj).length;
            }
        }
        
        if (typeof obj === 'string' || Array.isArray(obj)) {
            return obj.length;
        }
        
        return 0;
    }
    
    async Text (obj) {
        if (typeof obj.__str__ === "function") {
            return await obj.__str__();
        } else {
            return String(obj);            
        }
    }
    
    async Template (obj, context=null) {
        context = context || this;
        const template = await this.Text(obj);

        const expressions = [];
        var text = template.replace(/\{\{(.+?)\}\}/gm, (match, expressionSource) => {
            let i = expressions.length;
            expressions.push(new Expression(expressionSource));
            return `{{${i}}}`;
        });       
        
        for (let i=0; i<expressions.length; i++) {
            let expression = expressions[i];
            let value = await expression.evaluate(context);
            text = text.replace(`{{${i}}}`, value);
        }
        
        return text;
    }
    
    async Markdown (obj, context=null) {
        const markdown = await this.Template(obj, context);
        return marked(markdown);        
    }
}


module.exports = Context;
