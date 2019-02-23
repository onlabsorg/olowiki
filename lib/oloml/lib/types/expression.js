const parser = require("../parser");
const oloxp = require("oloxp");


class Expression extends parser.ScalarType {
    
    async call (context, ...args) {
        context = Object.create(context);
        context.args = args;
        return await oloxp.evaluate(this.data, context);
    }    
}


module.exports = Expression;
