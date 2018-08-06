
const URL = require("url");
const YAML = require("js-yaml");


const types = {
    "!=": require("./types/expression"),
    "!template": require("./types/template"),
    "!link": require("./types/link"),
    "!markdown": require("./types/markdown"),
    "!composition": require("./types/composition"),
    "!rem": require("./types/comment"),
};




class Document {

    constructor (store, url, content, user) {
        this.store = store;
        this.url = url;
        this.content = content;
        this.user = user;
        
        const yamlTypes = [];
        for (let tag in types) {
            let Type = types[tag];
            yamlTypes.push( Type.createYAMLType(tag, this) );
        }
        this.schema = YAML.Schema.create(YAML.DEFAULT_SAFE_SCHEMA, yamlTypes);
        this.loadContent(content);
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
    
    loadContent (content) {
        this.data = Object(YAML.load(content, {schema:this.schema}));
    }
    
    async render (path="render") {
        const target = getTarget(this.data, path);
        if (target === undefined) {
            return `${path} is not defined.`;
        }
        else if (target && typeof target.call === "function") {
            return await this.data.render.call(this.data);            
        }
        else {
            return String(target);
        }
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
