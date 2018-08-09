
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
        this.updateContent(source);
    }
    
    get author () {
        return this.data.author;
    }
    
    set author (value) {
        this.data.author = value;
    }
    
    get public () {
        return this.data.public;
    }
    
    set public (value) {
        this.data.public = Boolean(value);
    }
    
    updateContent (source) {
        this.data = Object(YAML.load(source, {schema:this.schema}));
    }
    
    async render (path="render") {
        const target = getTarget(this.data, path);
        
        if (target === undefined) 
                return this.renderValue(undefined);
                
        if (target === null) 
                return this.renderValue(null);
        
        if (typeof target.call === "function")
                return await target.call(this.data);            
                
        if (typeof target === "boolean")
                return this.renderValue(target);
                
        if (isNumber(target))
                return this.renderValue(target);
                        
        if (typeof target === "string")
                return target;
                
        if (Array.isArray(target))
                return this.renderArray(target);
                
        if (typeof target === "object")
                return this.renderObject(target);
                
        return String(target);
    }

    renderValue (value) {
        return `<div class="value">${value}</div>`;
    }
    
    renderObject (obj) {
        return this.renderValue("{...}");
    }
    
    renderArray (arr) {
        return this.renderValue("[...]");
    }
    
    async load (url) {
        throw new Error("Document loader not defined.");
    }
    
    async save () {
        throw new Error("Document saver not defined.");
    }
    
    toString () {
        let yaml = YAML.dump(this.data, {
            schema: this.schema,
            indent: 4,
            lineWidth: -1,
            noRefs: true,
        });
        for (let tag in types) {
            yaml = yaml.split(`!<${tag}>`).join(tag);
        }
        return yaml;
    }
}



function getTarget (obj, path) {
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
