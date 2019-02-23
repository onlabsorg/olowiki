
const YAML = require("js-yaml");


class Type {
    
    static get kind () {
        return undefined;
    }
        
    static validate (data) {
        return data !== null;
    }
    
    constructor (data) {
        this.data = data;
    }
    
    async call (context, caller, ...args) {
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


const types = new Map();


function Schema (types) {
    const yamlTypes = [];
    
    for (let [tagName, Type] of types) {
        yamlTypes.push( new YAML.Type(tagName, {
            kind: Type.kind,
            resolve: data => Type.validate(data),
            construct: data => new Type(data),
            instanceOf: Type,
            represent: type => type.data
        }));
    }
    
    return YAML.Schema.create(YAML.DEFAULT_SAFE_SCHEMA, yamlTypes);        
}



module.exports = {
    
    Type: Type, 
    
    ScalarType: ScalarType, 
    
    SequenceType: SequenceType, 
    
    MappingType: MappingType,
    
    get types () {
        return types;
    },
    
    parse (source) {
        return YAML.load(source, {
            schema: Schema(this.types),
        });
    },

    stringify (object) {
        var source = YAML.dump(object, {
            schema: Schema(this.types),
            indent: 4,
            lineWidth: -1,
            noRefs: true,
            //sortKeys: true,
        });
        for (let tag of types.keys()) {
            source = source.split(`!<${tag}>`).join(tag);
        }
        return source;
    }    
};
