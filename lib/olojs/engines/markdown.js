const engine = require("../engine");
const marked = require('marked');

exports.renderTemplate = async function (template, context) {
    const markup = await engine.renderTemplate(template, context);
    return marked(markup, this.options);
}    

exports.options = {};
