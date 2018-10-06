// Run test:
// mocha -u tdd test/olojs/store

const Store = require("../../lib/olojs/store");
const errors = require("../../lib/olojs/errors");
const expect = require("chai").expect;
const stripIndent = require("strip-indent");

const ExpressionType = require("../../lib/olojs/oloml-types/expression");
const TemplateType = require("../../lib/olojs/oloml-types/template");
const MarkdownType = require("../../lib/olojs/oloml-types/markdown");

const storePath = "/store";

suite("Store", () => {
        
    test("Store.constructor", () => {
        const store = new Store(storePath);
        expect(store.rootPath).to.equal(storePath);
    });    
    
    test("Store.prototype.createDocument", (done) => {
        async function runtest () {
            const store = new Store(storePath);
            store.readDocument = path => Object({data: {path:path}});
            const doc = store.createDocument("docs/doc1", stripIndent(`
                n: 100
                map:
                    n: 10
                    exp1: != n + this.n + $1
                    exp2: != map.exp1($1)
                    exp3: != 2 * PI
                    tpt: !template "Hello {{this.exp1($1)}}!"
                    mdn: !markdown "Hello {{this.exp1($1)}}!"
                    lnk: != import($1)
                `));
                
            expect(doc).to.be.instanceof(Store.Document);
            expect(doc.get('n')).to.equal(100);
            expect(doc.get('map.exp1')).to.be.instanceof(ExpressionType);
            expect(doc.get('map.tpt')).to.be.instanceof(TemplateType);
            expect(doc.get('map.mdn')).to.be.instanceof(MarkdownType);
            expect(await doc.evaluate('map.exp2', 1)).to.equal( 111 );
            expect(await doc.evaluate('map.exp3')).to.equal( 2*Math.PI );
            expect(await doc.evaluate('map.tpt', 2)).to.equal("Hello 112!");
            expect(await doc.evaluate('map.mdn', 2)).to.equal("<p>Hello 112!</p>\n");
            expect(await doc.data.map.lnk.evaluate(null, "/docs/doc2")).to.deep.equal({path: "/docs/doc2"});
            expect(await doc.data.map.lnk.evaluate(null, "./doc2")).to.deep.equal({path: "/docs/doc2"});
            expect(await doc.data.map.lnk.evaluate(null, "../doc2")).to.deep.equal({path: "/doc2"});
        }
        runtest().then(done).catch(done);
    });    
    
    test("Store.prototype.resolvePath", () => {
        const store = new Store("/store");
        expect(store.resolvePath("docs/doc")).to.equal("/store/docs/doc");
        expect(store.resolvePath("/docs/doc")).to.equal("/store/docs/doc");
        expect(store.resolvePath("../dir/../docs/doc")).to.equal("/store/docs/doc");
        expect(store.resolvePath("./docs/doc")).to.equal("/store/docs/doc");
    });
});
    
