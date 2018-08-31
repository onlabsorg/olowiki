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
            const contextPrototype = {a:1}
            parser.registerType("!=", ExpressionType, {
                ContextPrototype: () => contextPrototype,
            });
            var obj = parser.parse("exp: != '$1*this.x+a'");
            expect(obj.exp).to.be.instanceof(ExpressionType);
            expect(obj.exp.data).to.equal("$1*this.x+a");
            
            const self = {x:10};
            const val1 = await obj.exp.evaluate(self, 20);
            expect(val1).to.equal(201);            
            
            parser.registerType("!=", ExpressionType, {
                ContextPrototype: {x:10}
            });
            obj = parser.parse("exp: != '$1*this.x+a'");
            expect(obj.exp.options.ContextPrototype()).to.deep.equal({x:10});
        }
        runtest().then(done).catch(done);
    });    
    
    test("stringifying", (done) => {
        async function runtest () {
            const parser = new oloml.Parser();
            parser.registerType("!=", ExpressionType, {});
            const obj = parser.parse("exp: != $1*this.x");
            const source = parser.stringify(obj);
            expect(source).to.equal("exp: != $1*this.x\n");
        }
        runtest().then(done).catch(done);        
    });
});
    
