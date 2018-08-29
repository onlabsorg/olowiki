const oloml = require("../oloml");
const oloxp = require("../oloxp");


class Expression extends oloml.ScalarType {
    
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
    
    async evaluate (self, ...args) {
        const context = this.Context(this.options.ContextPrototype(), self, ...args);
        try {
            return await oloxp.evaluate(this.data, context);
        }
        catch (error) {
            return this.options.renderError(error);
        }
        
    }
}


module.exports = Expression;
