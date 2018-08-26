const oloml = require("../oloml");

const Template = require("./template");
const marked = require("marked");


class Markdown extends oloml.ScalarType {
    
    constructor (data, options) {
        super(data, options);
        this.template = new Template(data, options);
    }
    
    async evaluate (scope, ...args) {
        const markdown = await this.template.evaluate(scope, ...args);
        return marked(markdown);
    }
}


module.exports = Markdown;
