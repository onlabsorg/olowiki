const oloml = require("../oloml");
const oloxp = require("../oloxp");


class Expression extends oloml.ScalarType {
    
    async evaluate (scope, ...args) {
        const context = this.options.Context(scope, ...args);
        try {
            return await oloxp.evaluate(this.data, context);
        }
        catch (error) {
            return this.options.onError(error);
        }
        
    }
}


module.exports = Expression;
