
const olojs = require("olojs");
const context = new olojs.Context();
context.x = 10;

const parser = require("expression-eval");

const expr = "1 + x * (3+4)";
const iters = 100000;

var t0 = Date.now();
for (let i=0; i<iters; i++) {
    var ast = parser.parse(expr)
    //parser.eval(ast, context);
}
console.log("jsep took", Date.now()-t0, "ms");



async function runolojs () {
    for (let i=0; i<iters; i++) {
        let pexpr = new olojs.Expression(expr);
        //await pexpr.evaluate(context);
    }
}

t0 = Date.now();
runolojs().then(() => {
    console.log("olojs took", Date.now()-t0, "ms");
});
