
const YAML = require("js-yaml");


class Parser {
    
    constructor () {
        this._types = new Map();
    }
    
    registerType (tag, Type, options) {
        this._types.set(tag, Type.register(tag, options));
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
        
    static register (tagName, kind, options={}) {
        return new YAML.Type(tagName, {
            kind: kind,
            resolve: data => this.validate(data),
            construct: data => new this(data, options),
            instanceOf: this,
            represent: type => type.data
        });
    }
    
    static validate (data) {
        return data !== null;
    }
    
    constructor (data, options={}) {
        this.data = data;
        this.options = options;
    }
    
    async evaluate (scope, ...args) {
        return this.data;
    }
}

class ScalarType extends Type {
    
    static register (tagName, options) {
        return super.register(tagName, "scalar", options);
    }
    
    toString () {
        return String(this.data);
    }        
}

class SequenceType extends Type {
    
    static register (tagName, options) {
        return super.register(tagName, "sequence", options);
    }
}

class MappingType extends Type {
    
    static register (tagName, options) {
        return super.register(tagName, "mapping", options);
    }
}



module.exports = {Parser, Type, ScalarType, SequenceType, MappingType};
