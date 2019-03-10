
const Expression = require("./expression");
const marked = require("marked");

const isObject = (obj) => typeof obj === "object" && obj !== null;


class Context {
    
    async eval (expressionSource) {
        const expression = new Expression(expressionSource)
        return await expression.evaluate(this);
    }
    
    Node (domNode) {
        return new DomNodeProxy(domNode, this);
    }

    async size (obj) {
                
        if (isObject(obj)) {
            if (typeof obj.__size__ === "function") {
                return Number( await obj.__size__() ) || 0;
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
        if (typeof obj.__text__ === "function") {
            return await obj.__text__();
        } else {
            return String(obj);            
        }
    }
    
    async Template (source) {
        const template = await this.Text(source);

        const expressions = [];
        var text = template.replace(/\{\{(.+?)\}\}/gm, (match, expression) => {
            let i = expressions.length;
            expressions.push(expression);
            return `{{${i}}}`;
        });       
        
        for (let i=0; i<expressions.length; i++) {
            let expression = expressions[i];
            let value = await this.eval(expression);
            text = text.replace(`{{${i}}}`, value);
        }
        
        return text;
    }
    
    async Markdown (source) {
        source = await this.Text(source);
        return marked(source);
    }
}



class DomNodeProxy {
    
    constructor (domNode, context) {
        this._target = domNode;
        this._context = context;
    }
    
    get name () {
        return this._target.name;
    }
    
    get index () {
        return this._target.index;
    }
    
    async __get__ (n) {
        const child = this._target.getChild(n);
        if (child === null) return null;
        return await child.evaluate(this._context);
    }
    
    async __size__ () {
        return this._target.cardinality;
    }
    
    async __text__ () {
        return this._target.stringifyChildList();
    }
}

Context.prototype.Node.prototype = DomNodeProxy.prototype;



module.exports = Context;
