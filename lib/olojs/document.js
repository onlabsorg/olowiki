
const Path = require("path");
const DotPath = require("./path");

const oloml = require("./oloml");
const ExpressionType = require("./oloml-types/expression");
const TemplateType = require("./oloml-types/template");
const MarkdownType = require("./oloml-types/markdown");

const globals = require("./globals");



class Document extends oloml.MappingType {

    constructor (context) {                
        super({}, context);        
        this.parser = new oloml.Parser();        
        this.registerType("!=", ExpressionType)
            .registerType("!template", TemplateType)
            .registerType("!markdown", MarkdownType);
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
            try {
                target = await target.evaluate(self, ...args);
            } catch (error) {
                target = error;
            }
        }
        
        return target;
    }
    
    registerType (tag, Type) {
        this.parser.registerType(tag, Type, () => {
            const typeContext = Object.create(this.context);
            Object.assign(typeContext, this.data);
            return typeContext;
        });
        return this;
    }
    
    toString () {
        return this.dump();
    }        
}



module.exports = Document;
