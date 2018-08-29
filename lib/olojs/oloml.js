
const YAML = require("js-yaml");


class Parser {
    
    constructor () {
        this._types = new Map();
    }
    
    registerType (tagName, Type, options) {
        this._types.set(tagName, new YAML.Type(tagName, {
            kind: Type.kind,
            resolve: data => Type.validate(data),
            construct: data => new Type(data, options),
            instanceOf: Type,
            represent: type => type.data
        }));
        return this;
    }
    
    _getSchema () {
        const yamlTypes = Array.from( this._types.values() );
        return YAML.Schema.create(YAML.DEFAULT_SAFE_SCHEMA, yamlTypes);        
    }
    
    parse (source) {
        return YAML.load(source, {
            schema: this._getSchema(),
        });
    }

    stringify (object) {
        var source = YAML.dump(object, {
            schema: this._getSchema(),
            indent: 4,
            lineWidth: -1,
            noRefs: true,
            //sortKeys: true,
        });
        for (let tag of this._types.keys()) {
            source = source.split(`!<${tag}>`).join(tag);
        }
        return source;
    }
}



class Type {
    
    static get kind () {
        return undefined;
    }
        
    static validate (data) {
        return data !== null;
    }
    
    constructor (data, options) {
        this.data = data;
        this.options = options;
    }
    
    Context (contextPrototype, self, ...args) {
        const context = Object.create(contextPrototype);
        context.$0 = self;
        for (let i=0; i<args.length; i++) {
            context[`$${i+1}`] = args[i];
        }        
        return context;
    }
    
    async evaluate (self, ...args) {
        return this.data;
    }
}

class ScalarType extends Type {
    
    static get kind () {
        return "scalar";
    }
    
    toString () {
        return String(this.data);
    }        
}

class SequenceType extends Type {
    
    static get kind () {
        return "sequence";
    }    
}

class MappingType extends Type {
    
    static get kind () {
        return "mapping";
    }
}



module.exports = {Parser, Type, ScalarType, SequenceType, MappingType};
