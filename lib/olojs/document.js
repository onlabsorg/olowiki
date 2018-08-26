
const Path = require("path");
const oloml = require("./oloml");

const isNumber = require("lodash/isNumber");



class Document {

    constructor () {        
        this._parser = new oloml.Parser();
        this.data = {};        
    }
    
    get (path) {
        const pathArray = this._splitPath(path);
        var target = this.data;
        for (let pathItem of pathArray) {
            if (pathItem !== "") {
                try {
                    target = target[pathItem];
                } 
                catch (error) {
                    return undefined;
                }
            }
        }    
        return target;        
    }
    
    set (path, value) {
        const pathArray = this._splitPath(path);
        if (pathArray.length === 0) {
            this.data = value;
        }
        else {
            let key = pathArray.pop();
            let container = this.get(pathArray.join("."));
            container[key] = value;
        }
    }

    dump (path) {
        const data = path ? this.get(path) : this.data;
        return this._parser.stringify( data );
    }
    
    load (yamlText, path='') {
        const data = this._parser.parse(yamlText);
        this.set(path, data);
    }
    
    async render (path="index", context={}) {
        const target = this.get(path);

        if (target instanceof oloml.Type) {
            let scope = Object.create(context);
            Object.assign(scope, this.data);
            return await target.evaluate(scope);
        }
        
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
        this._parser.registerType(tag, Type, options);
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
