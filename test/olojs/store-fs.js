// Run test:
// mocha -u tdd test/olojs/store-fs

const fs = require('fs');
const FSStore = require("../../lib/olojs/stores/fs-store");
const errors = require("../../lib/olojs/errors");
const expect = require("chai").expect;


const Path = require("path");
const storePath = Path.normalize(`${__dirname}/../store`);


suite("FSStore", () => {
        
    test("FSStore.constructor", () => {
        const store = new FSStore(storePath, context);
        expect(store.rootPath).to.equal(storePath);
    });    
    
    test("FSStore.prototype.createDocument", () => {
        const store = new FSStore(storePath);
        const doc = store.createDocument("doc", "x: 10");
        expect(doc.data).to.deep.equal({x:10});
        expect(doc.context.import).to.be.a("function");
    });
    
    test("FSStore.prototype.readDocument", (done) => {
        var doc, store = new FSStore(storePath);
        
        async function runtest () {            
            doc = await store.readDocument('public');
            expect(await doc.evaluate("index") ).to.equal("Public document");
        }
        runtest().then(done).catch(done);
    });   
    
    test("FSStore.prototype.writeDocument", (done) => {
        var doc, doc2, store = new FSStore(storePath);
        try {
            fs.unlinkSync(store.resolvePath('testdoc'));            
        } catch (e) {}
        
        async function runtest () {
            doc = store.createDocument("testdoc", "");
            doc.set('author', "owner");
            doc.set('public', true);
            doc.set('index', "Test document");
            
            await store.writeDocument('testdoc', doc);
            doc2 = await store.readDocument("testdoc");
            expect(await doc2.evaluate("index") ).to.equal("Test document");
            
            doc.set('index', "Test document modif");
            await store.writeDocument('testdoc', doc);
            doc2 = await store.readDocument("testdoc");
            expect(await doc2.evaluate("index") ).to.equal("Test document modif");
        }
        runtest().then(done).catch(done);
    });
});
    
