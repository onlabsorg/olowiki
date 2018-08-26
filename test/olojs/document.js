// Run test:
// mocha -u tdd test/olojs/document

const Document = require("../../lib/olojs/document");
const ExpressionType = require("../../lib/olojs/oloml-types/expression");
const expect = require("chai").expect;
const stripIndent = require("strip-indent");




suite("Document", () => {
    
    test("Document.prototype.constructor", () => {
        const source = stripIndent(`
            x: 10
            s: "abc"
            a: [1,2,3]
            `);
        const doc = new Document();
        expect(doc.data).to.deep.equal({});
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
        const doc = new Document();
        doc.registerType("!=", ExpressionType, {
            Context: () => Object(),
            onError: (err) => String(err)
        });
        doc.load(`!= "1+1"`, 'exp');
        expect(doc.data.exp).to.be.instanceof(ExpressionType);
    });
    
    test("Document.prototype.render", (done) => {
        async function runtest () {
            const doc = new Document();
            doc.registerType("!=", ExpressionType, {
                Context: (scope, arg1) => {
                    const context = Object.create(doc.data);
                    context.$0 = scope;
                    context.$1 = arg1
                    return context;
                },
                onError: (err) => String(err)
            });
            doc.load(stripIndent(`
                map: 
                    num: 10
                    nul: null
                    bool: true
                    date: 1977-02-26
                    arr: [1,2,3]
                    obj: {x:10}
                    exp1: != this.num + $1
                    exp2: != map.exp1(2)
                index: Hello!
                `));         
            expect( await doc.render('index') ).to.equal("Hello!");
            expect( await doc.render() ).to.equal("Hello!");
            expect( await doc.render('map.undef') ).to.equal( Document.renderUndefined('map.undef') );
            expect( await doc.render('map.nul') ).to.equal( Document.renderNull('map.nul') );
            expect( await doc.render('map.bool') ).to.equal( Document.renderBoolean('map.bool', true) );
            expect( await doc.render('map.num') ).to.equal( Document.renderNumber('map.num', 10) );
            expect( await doc.render('map.date') ).to.equal( Document.renderDate('map.date', new Date("1977-02-26")) );
            expect( await doc.render('map.arr') ).to.equal( Document.renderArray('map.arr', [1,2,3]) );
            expect( await doc.render('map.obj') ).to.equal( Document.renderArray('map.obj', {x:10}) );
            expect( await doc.render('map.exp2') ).to.equal(12);
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
