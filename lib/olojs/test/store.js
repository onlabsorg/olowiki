const expect = require("chai").expect;
const Document = require("../lib/document");
const errors = require("../lib/errors");

module.exports = function test (storeName, Store) {
    
    describe(storeName, () => {
        var store;
        
        before(async () => {
            store = await Store({
                "/path/to/doc1"             : "doc1 source",
                "/path/to/doc2"             : "doc2 source",
                "/path/to/doc3"             : "doc3 source",
                "/path/to/container1/doc4"  : "doc5 source",
                "/path/to/container2/doc5"  : "doc6 source",
                "/path/TO/doc6"             : "doc7 source",
                "/a/b/c/doc7"               : "doc8 source",
            });
        });
        
        describe(`${storeName}.prototype.read(documentPath)`, () => {
            
            it("should return the document source stored at the given path", async () => {
                var doc = await store.read("path/to/doc1");
                expect(doc).to.be.equal("doc1 source");

                var doc = await store.read("/path/to/doc2");
                expect(doc).to.be.equal("doc2 source");
            });

            it("should return an empty string if the path doesn't exist", async () => {
                var doc = await store.read("/path/to/doc111");
                expect(doc).to.equal("");            
            });
        });        

        describe(`${storeName}.prototype.read(containerPath) - async method`, () => {
    
            it("should return a document source defining the 'items' list of the container item names", async () => {
                var source = await store.read("/path/to/");
                var doc = new Document(source);
                var docVal = await doc.evaluate();
                expect(docVal.items).to.be.an("array");
                console.log(docVal.items);
                expect(docVal.items.sort()).to.deep.equal([
                    "container1/",
                    "container2/",
                    "doc1",
                    "doc2",
                    "doc3",
                ]);
            });
    
            it("should work as well with root path `/`", async () => {
                var source = await store.read("/");
                var doc = new Document(source);
                var docVal = await doc.evaluate();
                expect(docVal.items).to.be.an("array");
                expect(docVal.items.sort()).to.deep.equal([
                    "a/",
                    "path/"
                ]);
            });

            it("should return a document source defining an empty 'items' list if the path doesn't exist", async () => {
                var source = await store.read("/path/to/non-existing/container/");
                var doc = new Document(source);
                var docVal = await doc.evaluate();
    
                expect(docVal.items).to.be.an("array");
                expect(docVal.items).to.deep.equal([]);
            });            
        });

        describe(`${storeName}.prototype.write(documentPath, source) - async method`, () => {
        
            it("should map the passed document source to the passed path", async () => {
                var docContent = "doc11 source";
                await store.write("/path/to/doc11", docContent);
                var doc = await store.read("/path/to/doc11");
                expect(doc).to.equal(docContent);
                
                var containerDescr = await store.read("/path/to/");
                var doc = new Document(containerDescr);
                var docVal = await doc.evaluate();    
                expect(docVal.items.sort()).to.deep.equal([
                    "container1/",
                    "container2/",
                    "doc1",
                    "doc11",
                    "doc2",
                    "doc3",
                ]);
            });
            
            it("should create the intermediate containers if they don't exist", async () => {
                var docContent = "doc12 source";
                await store.write("/path/to/container3/container4/doc12", docContent);
                var doc = await store.read("/path/to/container3/container4/doc12");
                expect(doc).to.equal(docContent);                
                
                var containerDescr = await store.read("/path/to/");
                var doc = new Document(containerDescr);
                var docVal = await doc.evaluate();    
                expect(docVal.items.sort()).to.deep.equal([
                    "container1/",
                    "container2/",
                    "container3/",
                    "doc1",
                    "doc11",
                    "doc2",
                    "doc3",
                ]);
                
                var containerDescr = await store.read("/path/to/container3/");
                var doc = new Document(containerDescr);
                var docVal = await doc.evaluate();    
                expect(docVal.items.sort()).to.deep.equal([
                    "container4/",
                ]);

                var containerDescr = await store.read("/path/to/container3/container4/");
                var doc = new Document(containerDescr);
                var docVal = await doc.evaluate();    
                expect(docVal.items.sort()).to.deep.equal([
                    "doc12",
                ]);
            });
        });

        describe(`${storeName}.prototype.write(containerPath, source) - async method`, () => {
            
            it("should throw olojs.errors.WriteOperationNotAllowed", async () => {
                var error = null;
                try {
                    await store.write("/path/to/container1/", "whatever content");
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.instanceof(errors.WriteOperationNotAllowed);
                expect(error.message).to.equal("Write operation not allowed on path '/path/to/container1/'");
            });
        });
        
        describe(`${storeName}.prototype.delete(documentPath) - async method`, () => {

            it("should remove the document at the given path", async () => {    
                var doc = await store.read("/path/to/doc11");
                expect(doc).to.equal("doc11 source");
                
                await store.delete("path/to/doc11");
                var doc = await store.read("/path/to/doc11");
                expect(doc).to.equal("");
                
                var containerDescr = await store.read("/path/to/");
                var doc = new Document(containerDescr);
                var docVal = await doc.evaluate();    
                expect(docVal.items.sort()).to.deep.equal([
                    "container1/",
                    "container2/",
                    "container3/",
                    "doc1",
                    "doc2",
                    "doc3",
                ]);                
            });
    
            it("should fail silentrly if the document doesn't exist", async () => {
                var doc = await store.read("/path/to/doc11");
                expect(doc).to.equal("");
                
                await store.delete("path/to/doc11");
                var doc = await store.read("/path/to/doc11");
                expect(doc).to.equal("");
                
                var containerDescr = await store.read("/path/to/");
                var doc = new Document(containerDescr);
                var docVal = await doc.evaluate();    
                expect(docVal.items.sort()).to.deep.equal([
                    "container1/",
                    "container2/",
                    "container3/",
                    "doc1",
                    "doc2",
                    "doc3",
                ]);                
            });            
        });
        
        describe(`${storeName}.prototype.delete(containerPath) - async method`, () => {
            
            it("should remove the given container and its content", async () => {
                
                // verify current situation
                var containerDescr = await store.read("/path/to/");
                var doc = new Document(containerDescr);
                var docVal = await doc.evaluate();    
                expect(docVal.items.sort()).to.deep.equal([
                    "container1/",
                    "container2/",
                    "container3/",
                    "doc1",
                    "doc2",
                    "doc3",
                ]);                
                
                var containerDescr = await store.read("/path/to/container3/");
                var doc = new Document(containerDescr);
                var docVal = await doc.evaluate();    
                expect(docVal.items.sort()).to.deep.equal([
                    "container4/",
                ]);

                var containerDescr = await store.read("/path/to/container3/container4/");
                var doc = new Document(containerDescr);
                var docVal = await doc.evaluate();    
                expect(docVal.items.sort()).to.deep.equal([
                    "doc12",
                ]);

                // delete container3
                await store.delete("/path/to/container3/");

                var containerDescr = await store.read("/path/to/");
                var doc = new Document(containerDescr);
                var docVal = await doc.evaluate();    
                expect(docVal.items.sort()).to.deep.equal([
                    "container1/",
                    "container2/",
                    "doc1",
                    "doc2",
                    "doc3",
                ]);                
                
                var containerDescr = await store.read("/path/to/container3/");
                var doc = new Document(containerDescr);
                var docVal = await doc.evaluate();    
                expect(docVal.items).to.deep.equal([])

                var containerDescr = await store.read("/path/to/container3/container4/");
                var doc = new Document(containerDescr);
                var docVal = await doc.evaluate();    
                expect(docVal.items).to.deep.equal([]);
            });

            it("should fail silently if the the given path doesn't exist", async () => {
                
                // verify current situation
                var containerDescr = await store.read("/path/to/");
                var doc = new Document(containerDescr);
                var docVal = await doc.evaluate();    
                expect(docVal.items.sort()).to.deep.equal([
                    "container1/",
                    "container2/",
                    "doc1",
                    "doc2",
                    "doc3",
                ]);                

                // delete container3
                await store.delete("/path/to/container3/");

                var containerDescr = await store.read("/path/to/");
                var doc = new Document(containerDescr);
                var docVal = await doc.evaluate();    
                expect(docVal.items.sort()).to.deep.equal([
                    "container1/",
                    "container2/",
                    "doc1",
                    "doc2",
                    "doc3",
                ]);                
            });
        });
    });
}
