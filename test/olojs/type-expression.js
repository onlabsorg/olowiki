// Run test:
// mocha -u tdd test/olojs/type-expression

const oloml = require("../../lib/olojs/oloml");
const ExpressionType = require("../../lib/olojs/oloml-types/expression");
const expect = require("chai").expect;
const stripIndent = require("strip-indent");



suite("ExpressionType", () => {
    
    test("parsing", (done) => {
        async function runtest () {
            const parser = new oloml.Parser();
            parser.registerType("!=", ExpressionType, {
                Context: function (self, arg1, arg2) {
                    return {$0:self, $1:arg1, $2:arg2}
                },
                onError (error) {
                    return "ERROR";
                }
            });
            const obj = parser.parse("exp: != '$1*this.x'");
            expect(obj.exp).to.be.instanceof(ExpressionType);
            expect(obj.exp.data).to.equal("$1*this.x");
            
            const self = {x:10};
            const val1 = await obj.exp.evaluate(self, 20);
            expect(val1).to.equal(200);

            const val2 = await obj.exp.evaluate(undefined, 20);
            expect(val2).to.equal("ERROR");
        }
        runtest().then(done).catch(done);
    });    
    
    test("stringifying", (done) => {
        async function runtest () {
            const parser = new oloml.Parser();
            parser.registerType("!=", ExpressionType, {
                Context: function (scope, ...args) {
                    return {}
                }
            });
            const obj = parser.parse("exp: != $1*this.x");
            const source = parser.stringify(obj);
            expect(source).to.equal("exp: != $1*this.x\n");
        }
        runtest().then(done).catch(done);        
    });
});
    
