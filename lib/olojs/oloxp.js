
const jsep = require('jsep');
const extend = require("lodash/extend");


exports.evaluate = function (expression, context) {
    if (!context.__this__) context.__this__ = context;
    const ast = jsep(expression);
    return evaluateNode(ast, context);
}



function evaluateNode ( node, context ) {

    switch ( node.type ) {

        case 'ArrayExpression':
            return evaluateArray( node.elements, context );

        case 'BinaryExpression':
            return binops[ node.operator ]( evaluateNode( node.left, context ), evaluateNode( node.right, context ) );

        case 'CallExpression':
            return evaluateFunction(node.callee, node.arguments, context);

        case 'ConditionalExpression':
            return evaluateNode( node.test, context )
                    ? evaluateNode( node.consequent, context )
                    : evaluateNode( node.alternate, context );

        case 'Identifier':
            return context[node.name];

        case 'Literal':
            return node.value;

        case 'LogicalExpression':
            return binops[ node.operator ]( evaluateNode( node.left, context ), evaluateNode( node.right, context ) );

        case 'MemberExpression':
            return evaluateMember(node, context)[1];

        case 'ThisExpression':
            return context.__this__;

        case 'UnaryExpression':
            return unops[ node.operator ]( evaluateNode( node.argument, context ) );

        default:
            return undefined;
    }
}



function evaluateArray ( list, context ) {
    return list.map(function (v) { return evaluateNode(v, context); });
}



function evaluateMember ( node, context ) {
    var object = evaluateNode(node.object, context);
    if ( node.computed ) {
        return [object, object[evaluateNode(node.property, context)]];
    } 
    else if (typeof(object) === "function" || node.property.name[0] === "_") {
        return undefined;
    }
    else {
        return [object, object[node.property.name]];
    }
}



function evaluateFunction (callee, args, context) {
    var caller, fn;
    if (callee.type === 'MemberExpression') {
        [caller, fn] = evaluateMember( callee, context );
    } else {
        fn = evaluateNode( callee, context );
    }
    if (fn && typeof fn.call === 'function') { 
        let fnContext = Object.create(context);
        fnContext.__this__ = caller;
        return fn.call( fnContext, ...evaluateArray( args, context ) );
    } else {
        return undefined;
    }
}


jsep.removeBinaryOp("||");
jsep.removeBinaryOp("&&");
jsep.removeBinaryOp("===");
jsep.removeBinaryOp("!==");

jsep.addBinaryOp("or", 1);
jsep.addBinaryOp("and", 2);

const binops = {
    'or':  function (a, b) { return a || b; },
    'and':  function (a, b) { return a && b; },
    '|':   function (a, b) { return a | b; },
    '^':   function (a, b) { return a ^ b; },
    '&':   function (a, b) { return a & b; },
    '==':  function (a, b) { return a === b; }, // jshint ignore:line
    '!=':  function (a, b) { return a !== b; }, // jshint ignore:line
    '<':   function (a, b) { return a < b; },
    '>':   function (a, b) { return a > b; },
    '<=':  function (a, b) { return a <= b; },
    '>=':  function (a, b) { return a >= b; },
    '<<':  function (a, b) { return a << b; },
    '>>':  function (a, b) { return a >> b; },
    '>>>': function (a, b) { return a >>> b; },
    '+':   function (a, b) { return a + b; },
    '-':   function (a, b) { return a - b; },
    '*':   function (a, b) { return a * b; },
    '/':   function (a, b) { return a / b; },
    '%':   function (a, b) { return a % b; }
};

const unops = {
  '-' :  function (a) { return -a; },
  '+' :  function (a) { return a; },
  '~' :  function (a) { return ~a; },
  '!' :  function (a) { return !a; },
};
