// Run test:
// mocha -u tdd test/olojs/store

const Store = require("../../lib/olojs/store");
const errors = require("../../lib/olojs/errors");
const expect = require("chai").expect;
const stripIndent = require("strip-indent");

const ExpressionType = require("../../lib/olojs/oloml-types/expression");
const TemplateType = require("../../lib/olojs/oloml-types/template");
const LinkType = require("../../lib/olojs/oloml-types/link");
const MarkdownType = require("../../lib/olojs/oloml-types/markdown");
const CompositionType = require("../../lib/olojs/oloml-types/composition");

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
                    exp2: != map.exp1(1)
                    tpt: !template "Hello"
                    mdn: !markdown "Hello"
                    cps: !composition
                        - Item 1
                        - Item 2
                        - Item 3
                    lnk: !link ./doc2
                `));
                
            expect(doc).to.be.instanceof(Store.Document);
            expect(doc.get('n')).to.equal(100);
            expect(doc.get('map.exp1')).to.be.instanceof(ExpressionType);
            expect(doc.get('map.tpt')).to.be.instanceof(TemplateType);
            expect(doc.get('map.mdn')).to.be.instanceof(MarkdownType);
            expect(doc.get('map.cps')).to.be.instanceof(CompositionType);
            expect(doc.get('map.lnk')).to.be.instanceof(LinkType);
            expect(await doc.render('map.exp2')).to.equal(Store.Document.renderNumber('map.exp2', 111));
            expect(await doc.data.map.lnk.evaluate()).to.deep.equal({
                path: "/docs/doc2"
            });
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
    
