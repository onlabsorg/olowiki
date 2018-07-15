
const expression = require("./utils/expression");


exports.renderTemplate = async function (template, context) {
    return template.replace(/\{\{(.+?)\}\}/gm, (match, expr) => {
        try {
            return expression.eval(expr, context);
        } catch (error) {
            return this.renderError(error);
        }
    });        
}
    
exports.renderError = function (error) {
    return `ERROR:[[${error}]]`;
}

exports.loaders = {}

exports.load = async function (engineName) {
    const loader = this.loaders[engineName];
    if (typeof loader === "function") {
        return await loader();
    } else {
        return this;
    }
}
