const parser = require("../lib/parser");
const expect = require("chai").expect;
const stripIndent = require("strip-indent");

const MarkdownType = require("../lib/types/markdown");



suite("MarkdownType", () => {
    
    setup(() => {
        parser.types.set("!markdown", MarkdownType);
    });
        
    test("parse", () => {
        const obj = parser.parse("mkdn: !markdown '# Hello {{$0}}!'");
        expect(obj.mkdn).to.be.instanceof(MarkdownType);
        expect(obj.mkdn.data).to.equal("# Hello {{$0}}!");
    });

    test("call", (done) => {
        async function runtest () {
            const obj = parser.parse("mkdn: !markdown '# Hello {{$0}}!'");
            const val1 = await obj.mkdn.call(null, {}, "you");
            expect(val1).to.equal(`<h1 id="hello-you-">Hello you!</h1>\n`);
        }
        runtest().then(done).catch(done);        
    });
    
    test("stringify", () => {
        const obj = parser.parse("mkdn: !markdown '# Hello {{$0}}!'");
        const source = parser.stringify(obj);
        expect(source).to.equal("mkdn: !markdown '# Hello {{$0}}!'\n");
    });
});
