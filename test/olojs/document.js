// Run test:
// mocha -u tdd test/olojs/document

const Document = require("../../lib/olojs/document");
const expect = require("chai").expect;
const stripIndent = require("strip-indent");

const oloml = require("../../lib/olojs/oloml");
const ExpressionType = require("../../lib/olojs/oloml-types/expression");
const TemplateType = require("../../lib/olojs/oloml-types/template");
const MarkdownType = require("../../lib/olojs/oloml-types/markdown");

const globals = require("../../lib/olojs/globals");




suite("Document", () => {
    
    test("Document.prototype.constructor", () => {
        const context = {};
        const source = stripIndent(`
            x: 10
            s: "abc"
            a: [1,2,3]
            `);
        var doc = new Document(context);
        expect(doc.data).to.deep.equal({});
        expect(doc.parser).to.be.instanceof(oloml.Parser);
        expect(doc.context).to.equal(context);
        
        doc = new Document(() => context);
        expect(doc.context).to.equal(context);
        
        class Context {}
        doc = new Document(Context);
        expect(doc.context).to.be.instanceof(Context);
    });
    
    test("Document.prototype.get", () => {
        const doc = new Document();
        doc.data = {
            s: "abc",
            P: {
                x: 10,
                y: 20,
                z: 30,               
            },
            a: [1,2,3]            
        };
        expect(doc.get('s')).to.equal("abc");
        expect(doc.get('P')).to.equal(doc.data.P);
        expect(doc.get('P.x')).to.equal(10);
        expect(doc.get('a.1')).to.equal(2);
        expect(doc.get('P.w')).to.be.undefined;
        expect(doc.get('')).to.equal(doc.data);
    });
    
    test("Document.prototype.set", () => {
        const doc = new Document();
        doc.data = {
            s: "abc",
            P: {
                x: 10,
                y: 20,
                z: 30,               
            },
            a: [1,2,3]            
        };
            
        doc.set('s', 'def');
        doc.set('P.x', 11);
        doc.set('a.1', 20);
        expect(doc.data).to.deep.equal({
            s: "def",
            P: {x:11, y:20, z:30},
            a: [1,20,3]
        })
        
        doc.set('', {n:1})
        expect(doc.data).to.deep.equal({n:1});
        
        expect(() => doc.set('A.x', 1)).to.throw(Error);
    });
    
    test("Document.prototype.load", () => {
        const doc = new Document();                
        
        doc.load(stripIndent(`
            map:
                s: "abc"
            `));
        expect(doc.data).to.deep.equal({
            map: {s: "abc"}
        })
        
        doc.load(stripIndent(`
            x: 10
            y: 20
            z: 30
            `), 'map.P');
        expect(doc.data.map.P).to.deep.equal({x:10, y:20, z:30});
        
        doc.load(stripIndent(`
            exp: != 1+1
            tpt: !template ""
            mkd: !markdown ""
            `));
        expect(doc.get('exp')).to.be.instanceof(ExpressionType);
        expect(doc.get('tpt')).to.be.instanceof(TemplateType);
        expect(doc.get('mkd')).to.be.instanceof(MarkdownType);
    });
    
    test("Document.prototype.dump", () => {
        const doc = new Document();
        doc.load(stripIndent(`
            map:
                txt: Hello
            `));                
        expect(doc.dump('map')).to.equal("txt: Hello\n");
    });
    
    test("Document.prototype.registerType", () => {
        const doc = new Document({a:1, b:2});
        doc.registerType("!=", ExpressionType);
        doc.data = {c:3, d:4};
        doc.load(`!= "1+1"`, 'exp');
        expect(doc.data.exp).to.be.instanceof(ExpressionType);
        expect(doc.data.exp.context.a).to.equal(1);
        expect(doc.data.exp.context.b).to.equal(2);
        expect(doc.data.exp.context.c).to.equal(3);
        expect(doc.data.exp.context.d).to.equal(4);
    });
    
    test("Document.prototype.evaluate", (done) => {
        async function runtest () {
            const doc = new Document({
                import: function (path) {
                    return {path};
                }
            });
            doc.load(stripIndent(`
                map: 
                    num: 10
                    nul: null
                    bool: true
                    date: 1977-02-26
                    arr: [1,2,3]
                    obj: {x: 10}
                    exp1: != this.num + $1
                    exp2: != map.exp1(2)
                    exp3: != import("/docs/doc2").path
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
            expect( await doc.evaluate('map.exp2') ).to.equal( 12 );
            expect( await doc.evaluate('map.exp3') ).to.equal("/docs/doc2");
        }
        runtest().then(done).catch(done);       
    });
    
    test("Document.prototype.toString", () => {
        const doc = new Document();
        doc.load(stripIndent(`
            map: 
                num: 10
                nul: null
                bool: true
                date: 1977-02-26
                arr: [1,2,3]
                obj: {x:10}
            index: Hello!
            `));         
        expect(String(doc)).to.equal(doc.dump(''));
    });
});
