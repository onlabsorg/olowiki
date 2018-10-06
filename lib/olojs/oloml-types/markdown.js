const oloml = require("../oloml");

const Template = require("./template");
const marked = require("marked");


class Markdown extends oloml.ScalarType {
    
    constructor (data, context) {
        super(data, context);
        this.template = new Template(data, context);
    }
    
    async evaluate (self, ...args) {
        const markdown = await this.template.evaluate(self, ...args);
        return marked(markdown);
    }
}


module.exports = Markdown;
