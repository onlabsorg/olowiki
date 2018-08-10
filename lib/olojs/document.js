
const URL = require("url");
const YAML = require("js-yaml");

const isNumber = require("lodash/isNumber");


const types = {
    "!=": require("./types/expression"),
    "!template": require("./types/template"),
    "!link": require("./types/link"),
    "!markdown": require("./types/markdown"),
    "!composition": require("./types/composition"),
    "!rem": require("./types/comment"),
};





class Document {

    constructor (source) {
        this.source = source;
        
        const yamlTypes = [];
        for (let tag in types) {
            let Type = types[tag];
            yamlTypes.push( Type.createYAMLType(tag, this) );
        }
        this.schema = YAML.Schema.create(YAML.DEFAULT_SAFE_SCHEMA, yamlTypes);
    }
    
    update (data) {
        this.source = YAML.dump(data, {
            schema: this.schema,
            indent: 4,
            lineWidth: -1,
            noRefs: true,
        });
        for (let tag in types) {
            this.source = this.source.split(`!<${tag}>`).join(tag);
        }
    }
    
    assign (newData) {
        const data = this.parse();
        Object.assign(data, newData);
        this.update(data);
    }
    
    parse () {
        return Object(YAML.load(this.source, {schema:this.schema}));        
    }
    
    compile () {
        const Document = this.constructor;
        const data = this.parse();

        return async function (path="index", context={}) {
            const target = getObjectProperty(data, path);

            if (target === undefined) {
                return Document.renderValue(undefined);
            }
                    
            if (target === null) {
                return Document.renderValue(null);
            }
            
            if (typeof target.call === "function") {
                let scope = Object.create(context);
                Object.assign(scope, data);
                return await target.call(scope);
            }
                    
            if (typeof target === "boolean") {
                return Document.renderValue(target);
            }
                    
            if (isNumber(target)) {
                return Document.renderValue(target);
            }
                            
            if (typeof target === "string") {
                return target;
            }
                    
            if (Array.isArray(target)) {
                return Document.renderArray(target);
            }
                    
            if (typeof target === "object") {
                return Document.renderObject(target);
            }
                    
            return String(target);            
        }
    }
    
    async load (url) {
        throw new Error("Document loader not defined.");
    }
    
    async save () {
        throw new Error("Document saver not defined.");
    }
    
    async render (path="render", context={}) {
        const render = this.compile();
        return await render(path, context);
    }

    static renderValue (value) {
        return `<div class="value">${value}</div>`;
    }
    
    static renderObject (obj) {
        return this.renderValue("{...}");
    }
    
    static renderArray (arr) {
        return this.renderValue("[...]");
    }
    
    toString () {
        return this.source;
    }
}



function getObjectProperty (obj, path) {
    const pathArray = path.split(".");
    var target = obj;
    for (let pathItem of pathArray) {
        try {
            target = target[pathItem];
        } 
        catch (error) {
            return undefined;
        }
    }    
    return target;
}




module.exports = Document;
