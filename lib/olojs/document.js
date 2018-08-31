
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
                    })
                   .registerType("!template", TemplateType, {
                       ContextPrototype: () => this.data,
                   })
                   .registerType("!markdown", MarkdownType, {
                       ContextPrototype: () => this.data,
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
            try {
                target = await target.evaluate(self, ...args);
            } catch (error) {
                target = error;
            }
        }
        
        return target;
    }
    
    registerType (tag, Type, options={}) {
        this.parser.registerType(tag, Type, options);
    }
    
    toString () {
        return this.dump();
    }    
    
}



module.exports = Document;
