
const parser = require('./parser');


exports.compile = function (ast) {
    return context => evaluateNode(ast, context);
}


exports.evaluate = async function (expression, context) {
    const ast = this.parse(expression);
    const evaluate = this.compile(ast);
    return await evaluate(context);        
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
            let [abj, property] = await evaluateMember(node, context);
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
    if ( node.computed ) {
        return [object, object[await evaluateNode(node.property, context)]];
    } 
    else if (typeof(object) === "function" || node.property.name[0] === "_" || node.property.name === "constructor") {
        return [object, undefined];
    }
    else {
        return [object, object[node.property.name]];
    }
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
        let fnContext = Object.create(context);
        fnContext.parent = caller || context;
        let value = await fn.call( context, ...fnArgs );
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
