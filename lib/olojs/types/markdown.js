const YAML = require("js-yaml");
const oloxp = require("../oloxp");

const Template = require("./template");
const marked = require("marked");


class Markdown {
    
    constructor (source, doc) {
        this.template = new Template(source, doc);
        this.doc = doc;
    }
    
    async call (scope, ...args) {
        const markdown = await this.template.call(scope, ...args);
        return marked(markdown);
    }

    toString () {
        return String(this.template);
    }
    
    static createYAMLType (tagName, doc) {
        return new YAML.Type(tagName, {
            
            kind: 'scalar',
            
            resolve: data => data !== null,
            
            construct: data => new this(data, doc),
            
            instanceOf: this,
            
            represent: markdown => String(markdown)
        });
    }
}


module.exports = Markdown;
