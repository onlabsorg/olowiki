
const URL = require("url");
const YAML = require("js-yaml");

const {Template, TemplateYamlType} = require("./types/template");



class Document {

    constructor (store, url, content) {
        this.store = store;
        this.url = url;
        this.content = content;
        this.schema = YAML.Schema.create(this.constructor.types);
        this.data = Object(YAML.load(content, {schema:this.schema}));
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
    
    async render () {
        if (this.data.main && typeof this.data.main.call === "function") {
            let context = Object.create(this.data);
            return await this.data.main.call(context);
        }
        else if (this.data.main) {
            return this.data.main;
        }
        else {
            return this.renderDefault();
        }
    }
    
    renderDefault () {
        return "No main view defined."
    }
    
    toString () {
        return YAML.dump(this.data, {
            schema: this.schema,
            indent: 4,
        });
    }
    
    static get types () {
        return [TemplateYamlType];
    }
}






module.exports = Document;
