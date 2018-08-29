
const Path = require("path");
const DotPath = require("./path");

const oloml = require("./oloml");
const ExpressionType = require("./oloml-types/expression");
const TemplateType = require("./oloml-types/template");
const LinkType = require("./oloml-types/link");
const MarkdownType = require("./oloml-types/markdown");
const CompositionType = require("./oloml-types/composition");

const isNumber = require("lodash/isNumber");



class Document extends oloml.MappingType {

    constructor (options={}) {        
        super({}, options);
        
        if (!this.options.path) this.options.path = "/doc";
        this.options.store = Object(this.options.store);
        if (typeof this.options.store.readDocument !== "function") {
            this.options.store.readDocument = path => Object({ data:{} });
        }
        
        this.parser = new oloml.Parser();        
        this.parser.registerType("!=", ExpressionType, {
                        ContextPrototype: () => this.data,
                        renderError: error => this.constructor.renderError(error)
                    })
                   .registerType("!template", TemplateType, {
                       ContextPrototype: () => this.data,
                       renderError: error => this.constructor.renderError(error)
                   })
                   .registerType("!markdown", MarkdownType, {
                       ContextPrototype: () => this.data,
                       renderError: error => this.constructor.renderError(error)
                   })
                   .registerType("!composition", CompositionType, this.Context.bind(this))
                   .registerType("!link", LinkType, {
                       basePath: Path.join(this.options.path, ".."),
                       loadDocument: path => this.options.store.readDocument(path)
                   });
    }
    
    get (path) {
        const dotPath = DotPath.from(path);
        return dotPath.lookup(this.data);
    }
    
    set (path, value) {
        const dotPath = DotPath.from(path);
        if (dotPath.length === 0) {
            this.data = value;
        }
        else {
            let key = dotPath.leaf;
            let container = this.get(dotPath.parent);
            container[key] = value;
        }
    }

    dump (path) {
        const data = path ? this.get(path) : this.data;
        return this.parser.stringify( data );
    }
    
    load (yamlText, path='') {
        const data = this.parser.parse(yamlText);
        this.set(path, data);
    }
    
    async evaluate (path, ...args) {
        var target = this.get(path);
        
        if (target instanceof oloml.Type) {
            let self = this.get(DotPath.from(path).parent);
            target = await target.evaluate(self, ...args);
        }
        
        return target;
    }
    
    async render (path="index", ...args) {
        const target = await this.evaluate(path, ...args);
        const type = detectType(target);
        const This = this.constructor;
        switch (type) {
            case "undefined":   return This.renderUndefined(path);
            case "null":        return This.renderNull(path);
            case "boolean":     return This.renderBoolean(path, target);
            case "number":      return This.renderNumber(path, target);
            case "date":        return This.renderDate(path, target);
            case "array":       return This.renderArray(path, target);
            case "object":      return This.renderObject(path, target);
            default:            return String(target);
        }        
    }
    
    registerType (tag, Type, options={}) {
        this.parser.registerType(tag, Type, options);
    }
    
    _splitPath (path) {
        if (path === "" || !path) return [];
        else return String(path).split(".");
    }
        
    toString () {
        return this.dump();
    }    
    
    static renderValue (path, value) {
        return `<div class="value">${value}</div>`;
    }
    
    static renderUndefined (path) {
        return this.renderValue(path, undefined);
    }
    
    static renderNull (path) {
        return this.renderValue(path, null);
    }

    static renderBoolean (path, value) {
        return this.renderValue(path, Boolean(value));
    }
    
    static renderNumber (path, value) {
        return this.renderValue(path, value);
    }
    
    static renderDate (path, date) {
        return this.renderValue(path, date.toISOString());
    }
    
    static renderObject (path, obj) {
        return this.renderValue("{...}");
    }
    
    static renderArray (path, arr) {
        return this.renderValue("[...]");
    }    
    
    static renderError (error) {
        return `<span class="error">ERROR:[[${error}]]</span>`;
    }
}



function detectType (obj) {
    const type = typeof obj;
    
    if (type === "object") {
        if (obj === null) return "null";
        if (Array.isArray(obj)) return "array";
        if (obj instanceof Date) return "date";
        return "object";
    }
    else {
        return type;
    }    
}




module.exports = Document;
