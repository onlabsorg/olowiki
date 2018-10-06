// Run test:
// mocha -u tdd test/olojs/store-http

const expect = require("chai").expect;

const fs = require('fs');
const HTTPStoreClient = require("../../lib/olojs/stores/http-store-client");
const HTTPStoreServer = require("../../lib/olojs/stores/http-store-server");
const errors = require("../../lib/olojs/errors");
const stripIndent = require("strip-indent");

require("isomorphic-fetch");

const Path = require("path");
const host = "http://localhost:8888";


suite("HTTPStoreClient", () => {
    
    test("HTTPStoreClient.constructor", () => {
        const store = new HTTPStoreClient(host, "owner");
        expect(store.rootPath).to.equal(host);
        expect(store.host).to.equal(host);
        expect(store.httpAuthorizationHeader).to.equal("owner");
    });    
    
    test("HTTPStoreClient.prototype.createDocument", () => {
        const store = new HTTPStoreClient(host, "owner");
        const doc = store.createDocument("doc", "x: 10");
        expect(doc.data).to.deep.equal({x:10});
        expect(doc.context.import).to.be.a("function");
    });
    
    test("HTTPStoreClient.prototype.readDocument", (done) => {
        async function runtest () {            
            var doc, store;
            
            store = new HTTPStoreClient(host, "owner");
            doc = await store.readDocument('/docs/public');
            expect(await doc.evaluate("index") ).to.equal("Public document");
            doc = await store.readDocument('/docs/private');
            expect(await doc.evaluate("index") ).to.equal("Private document");
            
            store = new HTTPStoreClient(host, "reader");
            doc = await store.readDocument('/docs/public');
            expect(await doc.evaluate("index") ).to.equal("Public document");
            try {
                doc = await store.readDocument('/docs/private');
                throw new Error("It didn't trow read access denied error.")
            } catch (error) {
                expect(error).to.be.instanceof(errors.ReadAccessDeniedError);
            }
        }
        runtest().then(done).catch(done);
    });   
    
    test("HTTPStoreClient.prototype.writeDocument", (done) => {
        
        async function runtest () {
            var doc, doc2, store;
            
            store = new HTTPStoreClient(host, "owner");
            
            doc = store.createDocument("testdoc", stripIndent(`
                public: Test document
                index: Test document
                `));            
            await store.writeDocument('/docs/testdoc', doc);
            doc2 = await store.readDocument("/docs/testdoc");
            expect(await doc2.evaluate("index") ).to.equal("Test document");            
            
            doc.set('index', "Test document modif");
            await store.writeDocument('/docs/testdoc', doc);
            doc2 = await store.readDocument("/docs/testdoc");
            expect(await doc2.evaluate("index") ).to.equal("Test document modif");

            store = new HTTPStoreClient(host, "reader");
            
            doc = store.createDocument("testdoc", stripIndent(`
                public: Test document modif again
                index: Test document
                `));            
            try {
                await store.writeDocument('/docs/testdoc', doc);
                throw new Error("It didn't throw write access denied error.")
            } catch (error) {
                expect(error).to.be.instanceof(errors.WriteAccessDeniedError);
            }
        }
        runtest().then(done).catch(done);
    });
});
    
