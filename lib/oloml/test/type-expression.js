const parser = require("../lib/parser");
const expect = require("chai").expect;
const stripIndent = require("strip-indent");

const ExpressionType = require("../lib/types/expression");



suite("ExpressionType", () => {
    
    setup(() => {
        parser.types.set("!=", ExpressionType);
    });
        
    test("parse", () => {
        const obj = parser.parse("exp: != '$1*this.b+a+$0'");
        expect(obj.exp).to.be.instanceof(ExpressionType);
        expect(obj.exp.data).to.equal("$1*this.b+a+$0");
    });

    test("call", (done) => {
        async function runtest () {
            const obj = parser.parse("exp: != '$1 * this.b + a + $0'");
            const context = {a:1, th:{b:10}};
            const value = await obj.exp.call(context.th, context, 2, 20);
            expect(value).to.equal(203);
        }
        runtest().then(done).catch(done);        
    });
    
    test("stringify", () => {
        const obj = parser.parse("exp: != $1*x");
        const source = parser.stringify(obj);
        expect(source).to.equal("exp: != $1*x\n");
    });
});
