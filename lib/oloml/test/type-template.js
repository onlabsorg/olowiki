const parser = require("../lib/parser");
const expect = require("chai").expect;
const stripIndent = require("strip-indent");

const TemplateType = require("../lib/types/template");



suite("TemplateType", () => {
    
    setup(() => {
        parser.types.set("!template", TemplateType);
    });
        
    test("parse", () => {
        const obj = parser.parse("temp: !template 'Hello {{name}} from {{$0}}!'");
        expect(obj.temp).to.be.instanceof(TemplateType);
        expect(obj.temp.data).to.equal("Hello {{name}} from {{$0}}!");
    });

    test("call", (done) => {
        async function runtest () {
            const obj = parser.parse("temp: !template 'Hello {{name}} from {{$0}}!'");
            const context = {name:"you"};
            const val1 = await obj.temp.call(null, context, "me");
            expect(val1).to.equal("Hello you from me!");
        }
        runtest().then(done).catch(done);        
    });
    
    test("stringify", () => {
        const obj = parser.parse("temp: !template 'Hello {{name}} from {{$0}}!'");
        const source = parser.stringify(obj);
        expect(source).to.equal("temp: !template 'Hello {{name}} from {{$0}}!'\n");        
    });
});
