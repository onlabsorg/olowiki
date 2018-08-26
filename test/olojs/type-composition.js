// Run test:
// mocha -u tdd test/olojs/type-composition

const oloml = require("../../lib/olojs/oloml");
const CompositionType = require("../../lib/olojs/oloml-types/composition");
const expect = require("chai").expect;
const stripIndent = require("strip-indent");



suite("CompositionType", () => {
    
    test("parsing", (done) => {
        async function runtest () {
            const parser = new oloml.Parser();
            parser.registerType("!composition", CompositionType, {});
            const obj = parser.parse(stripIndent(`
                comp: !composition 
                    - "abc"
                    - "def"
            `));
            expect(obj.comp).to.be.instanceof(CompositionType);
            expect(obj.comp.data).to.deep.equal(["abc", "def"]);            
            
            const val1 = await obj.comp.evaluate(null);
            expect(val1).to.equal("abcdef");
            
            const item3 = new oloml.Type();
            item3.evaluate = (self, arg1) => arg1;
            obj.comp.data.push(item3);
            const val2 = await obj.comp.evaluate(null, "ghi");
            expect(val2).to.equal("abcdefghi");
        }
        runtest().then(done).catch(done);
    });    
    
    test("stringifying", (done) => {
        async function runtest () {
            const parser = new oloml.Parser();
            parser.registerType("!composition", CompositionType, {});
            const obj = parser.parse(stripIndent(`
                comp: !composition 
                    - "abc"
                    - "def"
            `));
            const source = parser.stringify(obj);
            expect(source).to.equal(`comp: !composition \n    - abc\n    - def\n`);
        }
        runtest().then(done).catch(done);        
    });
});
    
