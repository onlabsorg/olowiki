
const parser = require('./xp-parser');


class Expression {
    
    constructor (source) {
        this._source = source;
        try {
            this._ast = parse(source);            
            this._error = null;
        } catch (error) {
            this._ast = null;
            this._error = error;
        }
    }
    
    async evaluate (context={}) {
        if (this._error) throw this._error;
        return await evaluate(this._ast, context);            
    }
    
    toString () {
        return this._source;
    }
}



function parse (expression) {
    var ast = {};
    
    const fnMatch = expression.match(/^\s*\((.*)\)\s*->(.+)$/);
    if (fnMatch) {
        var ast = {};
        ast.isFunction = true;
        ast.fnParams = fnMatch[1].split(",").map(param => param.trim());
        if (ast.fnParams.length === 1 && ast.fnParams[0] === "") {
            ast.fnParams = [];
        }
        for (let param of ast.fnParams) {
            if (!param.match(/^[A-Za-z_][A-Za-z_0-9]*$/)) {
                throw new Error(`Invalid parameter name: '${param}'`);
            }
        }
        ast.fnBody = parser.parse(fnMatch[2]);
        return ast;
        
    } else {
        var ast = parser.parse(expression);            
    }
    
    return ast;
}


async function evaluate (ast, context) {
    if (ast.isFunction) {
        return async function (...args) {
            const fnContext = Object.create(context);
            let i = 0;
            for (let param of ast.fnParams) {
                fnContext[param] = args[i];
                i += 1;
            }
            fnContext.this = this;
            return await evaluateNode(ast.fnBody, fnContext)
        }
    } else {
        return await evaluateNode(ast, context);
    }
}





async function evaluateNode ( node, context ) {

    switch ( node.type ) {

        case 'ArrayExpression':
            return await evaluateArray( node.elements, context );

        case 'BinaryExpression':
            return binaryOps[ node.operator ]( await evaluateNode( node.left, context ), await evaluateNode( node.right, context ) );

        case 'CallExpression':
            return await evaluateFunction(node.callee, node.arguments, context);

        case 'Identifier':
            return context[node.name];

        case 'Literal':
            return node.value;

        case 'LogicalExpression':
            return binaryOps[ node.operator ]( await evaluateNode( node.left, context ), await evaluateNode( node.right, context ) );

        case 'MemberExpression':
            let [obj, property] = await evaluateMember(node, context);
            return property;

        case 'UnaryExpression':
            return unaryOps[ node.operator ]( await evaluateNode( node.argument, context ) );

        default:
            return undefined;
    }
}



async function evaluateArray ( list, context ) {
    var values = [];
    for (let node of list) {
        values.push(await evaluateNode(node, context));
    }
    return values;
}



async function evaluateMember ( node, context ) {
    var object = await evaluateNode(node.object, context);
    
    var key = node.computed ? await evaluateNode(node.property, context) : node.property.name;    
    if (typeof(object) === "function" || key[0] === "_" || key === "constructor") {
        return [object, undefined];
    }    
    
    var value = object[key];
    if (value === undefined && typeof object.__get__ === 'function') {
        value = await object.__get__(key);
    }
    
    return [object, value];    
}



async function evaluateFunction (callee, args, context) {
    var caller, fn;
    
    if (callee.type === 'MemberExpression') {
        [caller, fn] = await evaluateMember( callee, context );
    } else {
        fn = await evaluateNode( callee, context );
    }
    
    if (fn && typeof fn.call === "function") {
        let fnArgs = await evaluateArray( args, context );
        let self = caller || context;
        let value = await fn.call( self, ...fnArgs );
        return value;
    }
    else {
        return undefined;
    }
}






const unaryOps = {};
parser.removeAllUnaryOps();
function addUnaryOp (op, func) {
    parser.addUnaryOp(op);
    unaryOps[op] = func;
}

const binaryOps = {};
parser.removeAllBinaryOps();
function addBinaryOp (op, precedence, func) {
    parser.addBinaryOp(op, precedence);
    binaryOps[op] = func;
}

addUnaryOp("not", a => !a);
addUnaryOp("+",   a => a);
addUnaryOp("-",   a => -a);

addBinaryOp("or",   1, (a, b) => a || b);
addBinaryOp("else", 1, (a, b) => a !== undefined ? a : b);
addBinaryOp("and",  2, (a, b) => a && b);
addBinaryOp("if",   3, (a, b) => b ? a : undefined);
addBinaryOp("==",   6, (a, b) => a === b);
addBinaryOp("!=",   6, (a, b) => a !== b);
addBinaryOp("<",    7, (a, b) => a < b);
addBinaryOp("<=",   7, (a, b) => a <= b);
addBinaryOp(">",    7, (a, b) => a > b);
addBinaryOp(">=",   7, (a, b) => a >= b);
addBinaryOp("+",    9, (a, b) => a + b);
addBinaryOp("-",    9, (a, b) => a - b);
addBinaryOp("*",   10, (a, b) => a * b);
addBinaryOp("/",   10, (a, b) => a / b);
addBinaryOp("mod", 10, (a, b) => a % b);
addBinaryOp("^",   11, (a, b) => a ** b);



module.exports = Expression;
