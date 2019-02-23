// Run test:
// mocha -u tdd test/olojs/document

const expect = require("chai").expect;
const stripIndent = require("strip-indent");

const Document = require("../lib/document");

const parser = require("../lib/parser");

const ExpressionType = require("../lib/types/expression");
parser.types.set("!=", ExpressionType);

const TemplateType = require("../lib/types/template");
parser.types.set("!template", TemplateType);

const MarkdownType = require("../lib/types/markdown");
parser.types.set("!markdown", MarkdownType);





suite("Document", () => {
    
    test("Document.prototype.constructor", () => {
        const source = stripIndent(`
            x: 10
            s: "abc"
            a: [1,2,3]
            `);
        const context = {};
        var doc = new Document(source, context);
        expect(doc.source).to.equal(source);
        expect(doc.context).to.equal(context);
    });
    
    test("Document.prototype.get", () => {
        const source = stripIndent(`
            s: "abc"
            P:
                x: 10
                y: 20
                z: 30               
            a: [1,2,3]                        
            `);
        const doc = new Document(source);
        expect(doc.get('s')).to.equal("abc");
        expect(doc.get('P')).to.deep.equal({x:10, y:20, z:30});
        expect(doc.get('P.x')).to.equal(10);
        expect(doc.get('a.1')).to.equal(2);
        expect(doc.get('P.w')).to.be.undefined;
        expect(doc.get('')).to.deep.equal({s:"abc", P:{x:10, y:20, z:30}, a:[1,2,3]});
    });
    
    test("Document.prototype.evaluate", (done) => {
        async function runtest () {
            const doc = new Document(stripIndent(`
                map: 
                    num: 10
                    nul: null
                    bool: true
                    date: 1977-02-26
                    arr: [1,2,3]
                    obj: {x: 10}
                    exp1: != doc.map.num + parent.num + args[0]
                    exp2: != parent.exp1(2)
                index: Hello!
                `));         
            expect( await doc.evaluate('index') ).to.equal("Hello!");
            expect( await doc.evaluate('map.undef') ).to.equal( undefined );
            expect( await doc.evaluate('map.nul') ).to.equal( null );
            expect( await doc.evaluate('map.bool') ).to.equal( true );
            expect( await doc.evaluate('map.num') ).to.equal( 10 );
            expect( await doc.evaluate('map.date') ).to.be.instanceof( Date );
            expect( await doc.evaluate('map.arr') ).to.deep.equal( [1,2,3] );
            expect( await doc.evaluate('map.obj') ).to.deep.equal( {x:10} );
            expect( await doc.evaluate('map.exp1', 2) ).to.equal( 22 );
            expect( await doc.evaluate('map.exp2') ).to.equal( 22 );
        }
        runtest().then(done).catch(done);       
    });
    
    test("Document.prototype.toString", () => {
        const source = stripIndent(`
            map: 
                num: 10
                nul: null
                bool: true
                date: 1977-02-26
                arr: [1,2,3]
                obj: {x:10}
            index: Hello!
            `);
        const doc = new Document(source);
        expect(String(doc)).to.equal(source);
    });
});
