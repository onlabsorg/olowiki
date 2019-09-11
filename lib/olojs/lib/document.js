
const defaultContext = require("./context");




class Document {
        
    // This class constructor is not supposed to be called directly but
    // to be returned by the `Hub.prototype.read` method.
    constructor (source, context=defaultContext) {        
        this.source = source;
        this.context = context;
    }
    
    async evaluate () {
        const scope = Object.create(this.context);

        if (typeof this.source === "object" && this.source !== null) {
            for (let key in this.source) {
                if (key !== "toString") scope[key] = this.source[key];
            }
        }

        var text = String(this.source);
        
        const expressions = [];
        text = text.replace(/<%([\s\S]+?)%>/g, (match, expression) => {  
            let i = expressions.length;
            expressions.push(expression);
            return `<%${i}%>`;
        });       
        
        for (let i=0; i<expressions.length; i++) {
            let value = await scope.eval(expressions[i]);
            let valueStr = await scope.str(value);
            text = text.replace(`<%${i}%>`, valueStr);
        }
        
        const docNamespace = {};

        const docNames = Object.getOwnPropertyNames(scope);
        for (let name of docNames) {
            docNamespace[name] = scope[name];
        }

        text = await scope.$call(scope.__render__, text);
        docNamespace.toString = docNamespace.__text__ = () => text;

        return docNamespace;    
    }
    
    toString () {
        return this.source;
    }
}


module.exports = Document;
