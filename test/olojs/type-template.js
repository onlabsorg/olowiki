// Run test:
// mocha -u tdd test/olojs/type-template

const oloml = require("../../lib/olojs/oloml");
const TemplateType = require("../../lib/olojs/oloml-types/template");
const expect = require("chai").expect;
const stripIndent = require("strip-indent");



suite("TemplateType", () => {
    
    test("parsing", (done) => {
        async function runtest () {
            const parser = new oloml.Parser();
            parser.registerType("!template", TemplateType, {
                Context: function (self, arg1, arg2) {
                    return {$0:self, $1:arg1, $2:arg2}
                },
                onError (error) {
                    return "ERROR";
                }
            });
            const obj = parser.parse("temp: !template 'Hello {{$0.name}} from {{$1}} and {{$2}}!'");
            expect(obj.temp).to.be.instanceof(TemplateType);
            expect(obj.temp.data).to.equal("Hello {{$0.name}} from {{$1}} and {{$2}}!");
            
            const self = {name:"you"};
            const val1 = await obj.temp.evaluate(self, "me", "him");
            expect(val1).to.equal("Hello you from me and him!");
            
            const val2 = await obj.temp.evaluate(undefined, "me", "him");
            expect(val2).to.equal("Hello ERROR from me and him!");
        }
        runtest().then(done).catch(done);
    });    
    
    test("stringifying", (done) => {
        async function runtest () {
            const parser = new oloml.Parser();
            parser.registerType("!template", TemplateType, {
                Context: function (scope, ...args) {
                    return {}
                }
            });
            const obj = parser.parse("temp: !template 'Hello {{$0.name}} from {{$1}} and {{$2}}!'");
            const source = parser.stringify(obj);
            expect(source).to.equal("temp: !template 'Hello {{$0.name}} from {{$1}} and {{$2}}!'\n");
        }
        runtest().then(done).catch(done);        
    });
});
    
