// Run test:
// mocha -u tdd test/olojs/type-link

const oloml = require("../../lib/olojs/oloml");
const LinkType = require("../../lib/olojs/oloml-types/link");
const expect = require("chai").expect;
const stripIndent = require("strip-indent");



suite("LinkType", () => {
    
    test("parsing", (done) => {
        async function runtest () {
            const parser = new oloml.Parser();
            parser.registerType("!link", LinkType, {
                loadDocument: (path) => Object({data:{path:path}}),
                basePath: "/store"
            });
            var obj = parser.parse("lnk: !link 'docs/docName'");
            expect(obj.lnk).to.be.instanceof(LinkType);
            expect(obj.lnk.data).to.deep.equal("docs/docName");
            
            const val1 = await obj.lnk.evaluate(null);
            expect(val1).to.deep.equal({
                path: "/store/docs/docName",
            });
            
            
            // default options
            parser.registerType("!link", LinkType, {});
            obj = parser.parse("lnk: !link 'docs/docName'");
            expect(obj.lnk.options.basePath).to.equal("/");
            const val2 = await obj.lnk.evaluate();
            expect(val2).to.deep.equal({});
        }
        runtest().then(done).catch(done);
    });    
    
    test("stringifying", (done) => {
        async function runtest () {
            const parser = new oloml.Parser();
            parser.registerType("!link", LinkType, {});
            const obj = parser.parse("lnk: !link 'targetURL'");
            const source = parser.stringify(obj);
            expect(source).to.equal("lnk: !link targetURL\n");
        }
        runtest().then(done).catch(done);        
    });
});
    
