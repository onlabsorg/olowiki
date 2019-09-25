/**
 *  # olojs.globals module
 *
 *  This module defines the global scope of an olojs document.
 *
 *  - License: MIT
 *  - Author: Marcello Del Buono <m.delbuono@onlabs.org>
 */




// Dependencies

const lexer = require("./expression/lexer");
const parser = require("./expression/parser");

const isBoolean = require("lodash/isBoolean");
const isNumber = require("lodash/isNumber");
const isString = require("lodash/isString");
const isFunction = require("lodash/isFunction");
const isArray = require("lodash/isArray");
const isObject = require("lodash/isObjectLike");


const context = {};


// Public constants

const NOTHING = context.NOTHING = null;
const FALSE   = context.FALSE   = 0;
const TRUE    = context.TRUE    = 1;
const LT = context.LT = -1;
const EQ = context.EQ = 0;
const GT = context.GT = +1;
const INFINITY = context.INFINITY = Infinity;
const ETC = context.ETC = parser.ETC;




// Core operations

context.$normalize = function (value) {
    if (value === null || value === undefined || Number.isNaN(value)) return NOTHING;
    if (value === true) return TRUE;
    if (value === false) return FALSE;
    return value;
}

context.$dot = function (namespace, name) {
    if (name.slice(0,2) === '__' && name.slice(-2) == "__") {
        return this.NOTHING;
    }

    if (isObject(namespace) && !isArray(namespace)) {
        return namespace[name];
    }
        
    return this.NOTHING;    
}

context.$call = async function (callable, ...args) {
    if (isFunction(callable)) {
        return await callable.call(this, ...args);
    } else if (isObject(callable) && isFunction(callable.__call__)) {
        return await callable.__call__.call(this, ...args);
    } else {
        return NOTHING; 
    }    
}

context.$query = async function (container, key) {

    if (isArray(key)) {
        let size = await this.size(container);
        let keyList = $query_normalizeKeyList(this, key, size);
        let items = [];
        for (let key of keyList) {
            let item = await this.$query(container, key);
            items.push(item);
        }
        return isString(container) ? items.join("") : items;
    }
    
    if (isString(container)) {
        if (isNumber(key)) {
            let index = $query_normalizeIndex(key, container.length);
            return container[index] || "";
        }
        if (isString(key)) {
            if (container.length === 0) return [];
            let found = [];
            let startIndex = 0;
            while (true) {
                let index = container.indexOf(key, startIndex);
                if (index === -1) break;
                found.push(index+1);
                startIndex = index + key.length;
            }
            return found;            
        }
        return "";
    }
    
    if (isArray(container)) {
        if (isNumber(key)) {
            let index = $query_normalizeIndex(key, container.length);
            return container[index] || NOTHING;
        }
        if (isObject(key)) {
            if (isFunction(key.__filter__)) {
                let items = [];
                for (let i=0; i<container.length; i++) {
                    let match = await key.__filter__(container[i], i+1, container);
                    match = await this.bool(match);
                    if (match) items.push(container[i]);
                }
                return items;
            }
            if (isFunction(key.__map__)) {
                let items = [];
                for (let i=0; i<container.length; i++) {
                    let item = await key.__map__(container[i], i+1, container);
                    items.push(item);
                }
                return items;
            }
            if (isFunction(key.__reduce__)) {
                var accumulator = this.NOTHING;
                for (let i=0; i<container.length; i++) {
                    accumulator = await key.__reduce__(accumulator, container[i], i+1, container);
                }
                return accumulator;
            }
        }
        return NOTHING;
    }
    
    if (isObject(container)) {
        if (isFunction(container.__get__)) {
            let item = await container.__get__(key);
            return this.$normalize(item);
        }
        if (isString(key)) {
            return await this.$dot(container, key);
        }
        return NOTHING;
    }
    
    return NOTHING;    
}

context.$getPrototypeOf = function (X) {
    if (X === this.NOTHING) return this.$NOTHING_PROTOTYPE;
    if (isNumber(X))        return this.$NUMBER_PROTOTYPE;
    if (isString(X))        return this.$TEXT_PROTOTYPE;
    if (isFunction(X))      return this.$FUNCTION_PROTOTYPE;
    if (isArray(X))         return this.$LIST_PROTOTYPE;
    if (isObject(X))        return this.$NAMESPACE_PROTOTYPE;
}





// Binary Operations

parser.defineBinaryOperation("or",   1, "$or"  );
parser.defineBinaryOperation("else", 1, "$else");
parser.defineBinaryOperation("and",  2, "$and" );
parser.defineBinaryOperation("if",   3, "$if"  );
parser.defineBinaryOperation("==",   4, "$eq"  );
parser.defineBinaryOperation("!=",   4, "$ne"  );
parser.defineBinaryOperation("<",    5, "$lt"  );
parser.defineBinaryOperation("<=",   5, "$le"  );
parser.defineBinaryOperation(">",    5, "$gt"  );
parser.defineBinaryOperation(">=",   5, "$ge"  );
parser.defineBinaryOperation("+",    6, "$add" );
parser.defineBinaryOperation("-",    6, "$sub" );
parser.defineBinaryOperation("*",    7, "$mul" );    
parser.defineBinaryOperation("/",    7, "$div" );
parser.defineBinaryOperation("mod",  7, "$mod" );
parser.defineBinaryOperation("^",    8, "$pow" );

context.$add = async function (L, R) {

    if (L === NOTHING) return R;
    if (R === NOTHING) return L;  
    
    if (isNumber(L)) {
        if (isObject(R) && !isArray(R) && isFunction(R.__add__)) {
            return await R.__add__(L);
        }
        return isNumber(R) ? L+R : NOTHING;
    }  
    
    if (isString(L)) {
        if (isObject(R) && !isArray(R) && isFunction(R.__add__)) {
            return await R.__add__(L);
        }
        return isString(R) ? L+R : NOTHING;
    }

    if (isArray(L)) {
        if (isObject(R) && !isArray(R) && isFunction(R.__add__)) {
            return await R.__add__(L);
        }
        return isArray(R) ? L.concat(R) : NOTHING;
    }
    
    if (isObject(L)) {
        if (isFunction(L.__add__)) {
            return await L.__add__(R);
        }
        if (isObject(R) && !isArray(R)) {
            if (isFunction(R.__add__)) {
                return await R.__add__(L);
            }
            let LuR = Object.create(L);                        
            for (let name in R) {
                LuR[name] = R[name];
            }
            return LuR;
        }
        return NOTHING;
    }
    
    return NOTHING;
}

context.$sub = async function (L, R) {
    
    if (L === NOTHING) return NOTHING;
    if (R === NOTHING) return L;
    
    if (isNumber(L)) {
        return isNumber(R) ? L - R : NOTHING;
    }
    
    if (isString(L)) return NOTHING;
    if (isArray(L)) return NOTHING;
    
    if (isObject(L)) {
        return isFunction(L.__sub__) ? await L.__sub__(R) : NOTHING;
    }
    
    return NOTHING;
}

context.$mul = async function (L, R) {
    
    if (L === NOTHING) return NOTHING;
    if (R === NOTHING) return NOTHING;
    
    if (isNumber(L)) {
        if (isNumber(R)) return L*R;
        if (isString(R)) return await this.$mul(R, L);
        if (isArray(R)) return await this.$mul(R, L);
        if (isObject(R)) return await this.$mul(R, L);
        return NOTHING;
    }
    
    if (isString(L)) {
        if (isObject(R) && !isArray(R) && isFunction(R.__mul__)) {
            return await R.__mul__(L);
        }
        return isNumber(R) ? L.repeat(R) : NOTHING;
    };
    
    if (isArray(L)) {
        if (isObject(R) && !isArray(R) && isFunction(R.__mul__)) {
            return await R.__mul__(L);
        }        
        if (isNumber(R)) {
            let list = [];
            for (let i=0; i<R; i++) list = list.concat(L);
            return list;
        }
        return NOTHING;
    }
    
    if (isObject(L)) {
        if (isFunction(L.__mul__)) {
            return await L.__mul__(R);
        }
        if (isObject(R) && !isArray(R) && isFunction(R.__mul__)) {
            return await R.__mul__(L);
        }
        return NOTHING;
    }
    
    return NOTHING;
}

context.$div = async function (L, R) {
    
    if (L === NOTHING) return NOTHING;
    if (R === NOTHING) return NOTHING;
    
    if (isNumber(L)) {
        return isNumber(R) ? L / R : NOTHING;
    }
    
    if (isString(L)) return NOTHING;
    if (isArray(L)) return NOTHING;
    
    if (isObject(L)) {
        return isFunction(L.__div__) ? await L.__div__(R) : NOTHING;
    }
    
    return NOTHING;
}

context.$mod = async function (L, R) {
    
    if (L === NOTHING) return NOTHING;
    if (R === NOTHING) return NOTHING;
    
    if (isNumber(L)) {
        return isNumber(R) ? L % R : NOTHING;
    }
    
    if (isString(L)) return NOTHING;
    if (isArray(L)) return NOTHING;
    
    if (isObject(L)) {
        return isFunction(L.__mod__) ? await L.__mod__(R) : NOTHING;
    }
    
    return NOTHING;
}

context.$pow = async function (L, R) {
    
    if (L === NOTHING) return NOTHING;
    if (R === NOTHING) return NOTHING;
    
    if (isNumber(L)) {
        return isNumber(R) ? L ** R : NOTHING;
    }
    
    if (isString(L)) return NOTHING;
    if (isArray(L)) return NOTHING;
    
    if (isObject(L)) {
        return isFunction(L.__pow__) ? await L.__pow__(R) : NOTHING;
    }
    
    return NOTHING;
}

context.$eq = async function (L, R) {
    const cmp = await compare(this, L, R);
    return cmp === EQ ? TRUE : FALSE;
}

context.$ne = async function (L, R) {
    const cmp = await compare(this, L, R);
    return cmp === EQ ? FALSE : TRUE;
}

context.$lt = async function (L, R) {
    const cmp = await compare(this, L, R);
    return cmp === LT ? TRUE : FALSE;
}

context.$le = async function (L, R) {
    const cmp = await compare(this, L, R);
    return cmp === GT ? FALSE : TRUE;
}

context.$gt = async function (L, R) {
    const cmp = await compare(this, L, R);
    return cmp === GT ? TRUE : FALSE;
}

context.$ge = async function (L, R) {
    const cmp = await compare(this, L, R);
    return cmp === LT ? FALSE : TRUE;
}

context.$and = async function (L, R) {
    return await this.bool(L) && await this.bool(R);
}

context.$or = async function (L, R) {
    return await this.bool(L) || await this.bool(R);
}

context.$if = async function (L, R) {
    const BR = await this.bool(R);
    return BR === TRUE ? L : NOTHING;
}

context.$else = async function (L, R) {
    return L === NOTHING ? R : L;
}






// Public functions

context.__render__ = async function (text) {
    return text;
}

context.size = async function (value) {
    if (value === NOTHING) return 0;
    if (value === undefined) return 0;
    if (Number.isNaN(value)) return 0;
    if (value === false) return 0;
    if (value === true) return 1;
    if (isNumber(value)) return Math.abs(value);
    if (isString(value)) return value.length;
    if (isArray(value)) return value.length;
    if (isObject(value)) {
        if (isFunction(value.__size__)) {
            let size = await value.__size__();
            return isNumber(size) ? Math.abs(Math.round(size)) : 0;
        }
        let size = 0;
        for (let item of enumerate(value)) size++;
        return size;
    }
    return 0;
}

context.bool = async function (value) {
    const size = await this.size(value);
    return size === 0 ? FALSE : TRUE;
}

context.not = async function (value) {
    return await this.bool(value) === FALSE ? TRUE : FALSE;
}

context.str = async function (X) {
    const X_PROTOTYPE = this.$getPrototypeOf(X);
    return await X_PROTOTYPE.__text__.call(this, X);
}

context.list = function (X) {
    if (X === NOTHING) return [];
    if (isNumber(X)) return Array.from(X);
    if (isString(X)) return Array.from(X);
    if (isArray(X)) return X;
    if (isObject(X)) return Array.from( enumerate(X) ).sort().map(name => ({name:name, value:X[name]}));
    return NOTHING;
}

context.range = function (a, b) {
    if (!isNumber(a) || !isNumber(b)) return [];
    var item = Math.round(a);
    const lastItem = Math.round(b);
    const step = item <= lastItem ? +1 : -1;
    const items = [];
    while (item !== lastItem) {
        items.push(item);
        item += step;
    }
    items.push(lastItem);
    return items;    
}



// Prototypes

context.$NOTHING_PROTOTYPE = {
    
    __text__ (NOTHING) {
        return "";
    },
};

context.$NUMBER_PROTOTYPE = {
    
    __text__ (number) {
        return String(number);
    },
};

context.$TEXT_PROTOTYPE = {
        
    __text__ (string) {
        return string;
    },
};

context.$FUNCTION_PROTOTYPE = {
        
    __text__ (string) {
        return "";
    },    
};

context.$LIST_PROTOTYPE = {
    
    async __text__ (array) {
        //return JSON.stringify(array);
        let str = "";
        for (let item of array) str += await this.str(item);
        return str;
    },        
};

context.$NAMESPACE_PROTOTYPE = {
    
    async __text__ (object) {
        if (isString(object.__text__)) {
            return object.__text__;
        }
        if (isFunction(object.__text__)) {
            let text = await object.__text__.call(this);
            if (isString(text)) return text;
        }
        return JSON.stringify(object);
    }
};



// Service functions

async function compare (scope, L, R) {
    
    // nothing is equal to iself and less than anything else
    if (L === NOTHING) {
        return R === NOTHING ? EQ : LT;     
    }
    
    // numbers are ...
    if (isNumber(L)) {
        if (R === NOTHING) return GT;   // ... always greater than NOTHING
        if (isNumber(R)) {              // ... compared as numbers with numbers
            if (L < R) return LT;
            if (L > R) return GT;
            return EQ;
        }
        if (isString(R)) return LT;     // ... always less than strings
        if (isArray(R)) return LT;      // ... always less than arrays
        if (isObject(R)) return LT;     // ... always less than objects
        throwUnknownDataType();
    }
    
    // strings are ...
    if (isString(L)) {
        if (R === NOTHING) return GT;   // ... always greater than NOTHING
        if (isNumber(R)) return GT;     // ... always greater than numbers
        if (isString(R)) {              // ... compared alphabetically with other strings
            if (L === R) return EQ
            let [first, second] = [L,R].sort();
            return L === first ? LT : GT;
        }
        if (isArray(R)) return LT;      // ... always less than arrays
        if (isObject(R)) return LT;     // ... always less than objects
        throwUnknownDataType();
    }
    
    // arrays are ...
    if (isArray(L)) {
        if (R === NOTHING) return GT;   // ... always greater than NOTHING
        if (isNumber(R)) return GT;     // ... always greater than numbers
        if (isString(R)) return GT;     // ... always greater than strings
        if (isArray(R)) {               // ... compared item by item with other arrays
            for (let i=0; i<L.length; i++) {
                if (i === R.length) return GT;
                let cmp = await compare(scope, L[i], R[i]);
                if (cmp === LT) return LT;
                if (cmp === GT) return GT;
            }
            return L.length < R.length ? LT : EQ;
        }
        if (isObject(R)) return LT;     // ... always less than objects ...
        throwUnknownDataType();
    }

    // objects are ...
    if (isObject(L)) {
        if (R === NOTHING) return GT;   // ... always greater than NOTHING
        if (isNumber(R)) return GT;     // ... always greater than numbers
        if (isString(R)) return GT;     // ... always greater than strings
        if (isArray(R)) return GT;      // ... always greater than arrays
        if (isObject(R)) {              // ... compared item by item with other objects ...
            if (isFunction(L.__vs__)) {     // ... unless it contains the method __vs__ ...
                let cmp = await L.__vs__(R);
                if (isNumber(cmp)) {
                    if (cmp === 0) return EQ;
                    return cmp < 0 ? LT : GT;
                }
            }
            if (isFunction(R.__vs__)) {     // ... or R contains the method __vs__
                let cmp = await R.__vs__(L);
                if (isNumber(cmp)) {
                    if (cmp === 0) return EQ;
                    return cmp < 0 ? GT : LT;
                }
            }
            let LNames = Array.from( enumerate(L) )
            for (let name of LNames) {
                let LItem = scope.$normalize(L[name]);
                let RItem = scope.$normalize(R[name]);
                let cmp = await compare(scope, LItem, RItem);
                if (cmp === GT) return GT;
                if (cmp === LT) return LT;
            }
            let LSize = LNames.length;
            let RSize = await scope.size(R);
            if (LSize === RSize) return EQ;
            return LSize < RSize ? LT : GT;
        }
        throwUnknownDataType();
    }  
    
    throwUnknownDataType();
}

function $query_normalizeKeyList (scope, keyList, size) {
    keyList = keyList.map(key => isNumber(key) ? $query_normalizeIndex(key, size)+1 : key);
    
    var etcIndex = keyList.indexOf(ETC);
    while (etcIndex !== -1) {
        if (etcIndex === 0 && keyList.length === 1) {
            keyList = scope.range(0, size);
        } else if (etcIndex === 0 && isNumber(keyList[1])) {
            let items = scope.range(0, keyList[1]);
            keyList.splice(0, 2, ...items);
        } else if (etcIndex === keyList.length-1 && isNumber(keyList[etcIndex-1])) {
            let items = scope.range(keyList[etcIndex-1], size);
            keyList.splice(etcIndex-1, 2, ...items);
        } else if (isNumber(keyList[etcIndex-1]) && isNumber(keyList[etcIndex+1])) {
            let items = scope.range(keyList[etcIndex-1], keyList[etcIndex+1]);
            keyList.splice(etcIndex-1, 3, ...items);
        } else {
            keyList.splice(etcIndex, 1);
        }
        etcIndex = keyList.indexOf(ETC);
    }    
    
    return keyList;
}

function $query_normalizeIndex (index, containerLength) {
    return index < 0 ? containerLength+index : index-1;
}  

function *enumerate (obj) {
    for (let key in obj) {
        if (key[0].match(/^[a-zA-Z]$/)) yield key;
    }    
}    

function throwUnknownDataType () {
    throw new Error("Unknown data type");
}



// Public API

class Expression {
    
    constructor (source) {
        this.source = source;
    }
    
    parse () {
        const tokens = lexer.tokenize(this.source);
        const ast = parser.parse(tokens);
        return ast;
    }
    
    async evaluate (expressionContext) {
        if (!context.isPrototypeOf(expressionContext)) {
            throw new Error("Invalid context.")
        };
        const ast = this.parse();
        return await ast.evaluate(expressionContext);
    }
    
    static createContext (globals={}) {
        const expressionContext = Object.create(context);
        Object.assign(expressionContext, globals);
        return Object.create(expressionContext);
    }
}


module.exports = Expression;
