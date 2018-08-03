
const URL = require("url");
const YAML = require("js-yaml");

const Expression = require("./types/expression");
const Template = require("./types/template");
const Link = require("./types/link");

const Markdown = require("./types/markdown");



class Document {

    constructor (store, url, content, user) {
        this.store = store;
        this.url = url;
        this.content = content;
        this.user = user;
        this.schema = YAML.Schema.create(YAML.DEFAULT_SAFE_SCHEMA, [
            Expression.createYAMLType("!=", this),
            Template.createYAMLType("!template", this),
            Link.createYAMLType("!link", this),
            Markdown.createYAMLType("!markdown", this),
        ]);
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
    
    async render () {
        if (this.data.render) {
            if (typeof this.data.render.call === "function") {
                return await this.data.render.call(this.data);
            }
            else  {
                return String(this.data.render);
            }
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
            lineWidth: -1,
        }).replace(/\!<(\!.+)>/gm, (match, tag) => tag);
    }
}






module.exports = Document;
