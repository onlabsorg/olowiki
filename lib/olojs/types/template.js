
const YAML = require("js-yaml");
const oloxp = require("../oloxp");

const isPlainObject = require("lodash/isPlainObject");


const Template = exports.Template = class {
    
    constructor (source) {
        this.source = String(source);
    }
    
    call (context) {
        return this.source.replace(/\{\{(.+?)\}\}/gm, (match, expr) => {
            try {
                return oloxp.evaluate(expr, context);
            } catch (error) {
                return this.renderError(error);
            }
        });                        
    }
    
    renderError (error) {
        return `ERROR:[[${error}]]`;        
    }
    
    toString () {
        return this.source;
    }
}

exports.TemplateYamlType = new YAML.Type('!template', {
    
    kind: 'scalar',
    
    resolve: data => data !== null,
    
    construct: data => new Template(data),
    
    instanceOf: Template,
    
    represent: template => String(template)
});
