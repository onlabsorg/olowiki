const oloml = require("../oloml");
const oloxp = require("../oloxp");


class Expression extends oloml.ScalarType {
    
    async evaluate (self, ...args) {
        const xpContext = oloxp.Context(this.context, self, ...args);
        return await oloxp.evaluate(this.data, xpContext);
    }
}


module.exports = Expression;
