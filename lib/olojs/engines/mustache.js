const expression = require("../utils/expression");
const mustache = require('mustache');
const assignIn = require("lodash/assignIn");


exports.renderTemplate = async function (template, context) {
    assignIn(context, this.builtins);
    return mustache.render(template, context);
}    

exports.builtins = {
    
    eval: function () {
        return function (expr, render) {
            return expression.eval(expr, this);
        }
    }    
}
