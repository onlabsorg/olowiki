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
                ContextPrototype: () => Object({other:"him"}),
                renderError: (error) => "ERROR"
            });
            var obj = parser.parse("temp: !template 'Hello {{$0.name}} from {{$1}} and {{other}}!'");
            expect(obj.temp).to.be.instanceof(TemplateType);
            expect(obj.temp.data).to.equal("Hello {{$0.name}} from {{$1}} and {{other}}!");
            
            const self = {name:"you"};
            const val1 = await obj.temp.evaluate(self, "me");
            expect(val1).to.equal("Hello you from me and him!");
            
            const val2 = await obj.temp.evaluate(undefined, "me", "him");
            expect(val2).to.equal("Hello ERROR from me and him!");
            
            
            parser.registerType("!template", TemplateType, {
                ContextPrototype: {x:10}
            });
            obj = parser.parse("temp: !template 'Hello!'");
            expect(obj.temp.options.ContextPrototype()).to.deep.equal({x:10});
            const error = {
                toString: () => "DEFAULT ERROR"
            }
            expect(obj.temp.options.renderError(error)).to.equal("DEFAULT ERROR");            
        }
        runtest().then(done).catch(done);
    });    
    
    test("stringifying", (done) => {
        async function runtest () {
            const parser = new oloml.Parser();
            parser.registerType("!template", TemplateType, {});
            const obj = parser.parse("temp: !template 'Hello {{$0.name}} from {{$1}} and {{$2}}!'");
            const source = parser.stringify(obj);
            expect(source).to.equal("temp: !template 'Hello {{$0.name}} from {{$1}} and {{$2}}!'\n");
        }
        runtest().then(done).catch(done);        
    });
});
    
