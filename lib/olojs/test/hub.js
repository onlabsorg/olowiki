// Run test:
// mocha -u tdd test/olojs/hub

const expect = require("chai").expect;
const stripIndent = require("strip-indent");

const Document = require("../lib/document");
const errors = require("../lib/errors");
const Hub = require("../lib/hub");



suite("Hub", () => {
    
    test("CRD operations", (done) => {
        async function runtest () {
            const hub = new Hub();
            const source = stripIndent(`
                name1: value1
                name2: value2

                    name3: value3

                    name4: value4
                        name5: value5
                
                name6: value6
                `);

            const docURL = "memory:///path/to/document";

            const doc0 = new Document(source);
            await hub.write(docURL, doc0);
            
            const doc1 = await hub.read(docURL);
            expect(String(doc1).trim()).to.equal(String(doc0).trim());
            expect(String(doc1).trim()).to.equal(source.trim());
            
            await hub.delete(docURL);
            const doc2 = await hub.read(docURL);
            expect(doc2).to.be.null;
        }
        runtest().then(done).catch(done);
    });    

    test("unknown store", (done) => {
        async function runtest () {
            const hub = new Hub();
            try {
                await hub.read("https://unknown.store/path/to/document");
                throw new Error("it didn't throw")
            } catch (error) {
                expect(error).to.be.instanceof(errors.UnknownStoreError);
            }
        }
        runtest().then(done).catch(done);
    });    
});
