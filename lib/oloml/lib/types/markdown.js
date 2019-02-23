const parser = require("../parser");

const Template = require("./template");
const marked = require("marked");


class Markdown extends parser.ScalarType {
    
    constructor (data) {
        super(data);
        this.template = new Template(data);
    }
    
    async call (context, ...args) {
        const markdown = await this.template.call(context, ...args);
        return marked(markdown);
    }
}


module.exports = Markdown;
