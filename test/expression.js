
const jsep = require("jsep");
const evaluateNode = require("../lib/olojs/types/template").evaluateNode;

jsep.addBinaryOp("and", 1);

const ast = jsep(`this.x`);

console.log(ast);
console.log(evaluateNode(ast, {
    x: {
        y: {
            a: 100,
            b: 200,
            foo: {
                call: function (scope, aa, bb) {
                    return [scope.a + aa, scope.b + bb]
                }
            }
        }
    },
    a: 10,
    b: 20
}));
