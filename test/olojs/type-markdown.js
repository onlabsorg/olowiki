// Run test:
// mocha -u tdd test/olojs/type-markdown

const oloml = require("../../lib/olojs/oloml");
const MarkdownType = require("../../lib/olojs/oloml-types/markdown");
const expect = require("chai").expect;
const stripIndent = require("strip-indent");



suite("MarkdownType", () => {
    
    test("parsing", (done) => {
        async function runtest () {
            const parser = new oloml.Parser();
            parser.registerType("!markdown", MarkdownType, {
                renderError: (error) => "ERROR"
            });
            var obj = parser.parse("mkdn: !markdown '# Hello {{$1}}!'");
            expect(obj.mkdn).to.be.instanceof(MarkdownType);
            expect(obj.mkdn.data).to.equal("# Hello {{$1}}!");
            
            const val1 = await obj.mkdn.evaluate(null, "you");
            expect(val1).to.equal(`<h1 id="hello-you-">Hello you!</h1>\n`);
            
            
            parser.registerType("!markdown", MarkdownType, {
                ContextPrototype: {x:10}
            });
            obj = parser.parse("mkdn: !markdown 'Hello!'");
            expect(obj.mkdn.options.ContextPrototype()).to.deep.equal({x:10});
            const error = {
                toString: () => "DEFAULT ERROR"
            }
            expect(obj.mkdn.options.renderError(error)).to.equal("DEFAULT ERROR");                        
        }
        runtest().then(done).catch(done);
    });    
    
    test("stringifying", (done) => {
        async function runtest () {
            const parser = new oloml.Parser();
            parser.registerType("!markdown", MarkdownType, {});
            const obj = parser.parse("mkdn: !markdown '# Hello {{$1}}!'");
            const source = parser.stringify(obj);
            expect(source).to.equal("mkdn: !markdown '# Hello {{$1}}!'\n");
        }
        runtest().then(done).catch(done);        
    });
});
    
