const expression = require("../utils/expression");
const mustache = require('mustache');


exports.renderTemplate = async function (template, scope) {
    const context = Object.create(this.builtins);
    Object.assign(context, scope);
    return mustache.render(template, context);
}    

exports.builtins = {
    
    eval: function () {
        return function (expr, render) {
            return expression.eval(expr, this);
        }
    }    
}
