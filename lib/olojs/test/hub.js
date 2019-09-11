const expect = require("chai").expect;
const stripIndent = require("strip-indent");

const Document = require("../lib/document");
const defaultContext = require("../lib/context");
const Hub = require("../lib/hub");
const MemoryStore = require("../lib/memory-store");

describe("olojs.Hub", () => {
    
    describe("new Hub(stores, context)", () => {
        
        it("should create a Hub instance with the given context propterty, defaulting to olojs.context", () => {
            var context = {};
            var hub = new Hub({}, context);
            expect(hub.context).to.equal(context);
            
            var hub = new Hub({});
            expect(hub.context).to.equal(defaultContext);
        });
    });
    
    describe("Hub.prototype.read(path) - async method", () => {
        
        it("should delegate to the proper mounted store's `read` method", async () => {
            var hub = new Hub({
                'mnt': {
                    async read (path) {
                        read = path;
                        return "";
                    }
                }
            });
            var read = null;
            var doc = await hub.read("/mnt/path/to/doc");
            expect(read).to.equal("/path/to/doc");
        });
        
        it("should wrap the text returned by the mounted store in an olojs.Document", async () => {
            var hub = new Hub({
                'mnt': {
                    async read (path) {
                        return path;
                    }
                }
            });
            var read = null;
            var doc = await hub.read("/mnt/path/to/doc");
            expect(doc).to.be.instanceof(Document);
            expect(doc.source).to.equal("/path/to/doc");
        });

        it("should pass to the olojs.Document constructor the hub context augumented with the `import` function", async () => {
            var mstore = new MemoryStore();
            await mstore.write("/path/to/doc1", `<% doc2 = import("./doc2") %>`);
            await mstore.write("/path/to/doc2", "Document 2");

            var hub = new Hub({
                'mem': mstore
            });

            var doc1 = await hub.read("/mem/path/to/doc1");
            var doc1Val = await doc1.evaluate();
            expect(String(doc1Val.doc2)).to.equal("Document 2");
        });        

        it("should return an empty document if the path doesn't exist", async () => {
            var mstore = new MemoryStore();
            var hub = new Hub({
                'mem': new MemoryStore()
            });

            var doc = await hub.read("/mem/path/to/doc");
            expect(doc).to.be.instanceof(Document);
            expect(doc.source).to.equal("");            
        });

        it("should return an empty document if no store is mounted on the path", async () => {
            var hub = new Hub({});
            var doc = await hub.read("/mem/path/to/doc");
            expect(doc).to.be.instanceof(Document);
            expect(doc.source).to.equal("");            
        });
        
        it("should return a document defining the `items` list of the store names if path is '/'", async () => {
            var hub = new Hub({
                'store1': new MemoryStore(),
                'store2': new MemoryStore(),
                'store3': new MemoryStore(),
            });
            
            var rootDoc = await hub.read("/");
            expect(rootDoc).to.be.instanceof(Document);
            
            var rootVal = await rootDoc.evaluate();
            expect(rootVal.items).to.be.an("array");
            expect(rootVal.items.sort()).to.deep.equal(["store1/", "store2/", "store3/"])            
        });
    });
    
    describe("Hub.prototype.write(path, source) - async method", () => {
        
        it("should delegate to the proper mounted store's `write` method", async () => {
            var source = "Document source.";
            var mstore = new MemoryStore();
            var written = null;
            
            var hub = new Hub({
                'mnt': {
                    async write (path, source) {
                        written = [path, source];
                    }
                },
                'mem': mstore
            });

            await hub.write("/mnt/path/to/doc", source);
            expect(written).to.deep.equal(["/path/to/doc", source]);            

            await hub.write("/mem/path/to/doc", source);
            expect(await mstore.read("/path/to/doc")).to.equal(source);
            expect((await hub.read("/mem/path/to/doc")).source).to.equal(source);
        });    
    });
    
    describe("Hub.prototype.delete(path) - async method", () => {
        
        it("should delegate to the proper mounted store's `delete` method", async () => {
            var mstore = new MemoryStore();
            var source = "Document source.";
            var deleted = null;

            var hub = new Hub({
                'mnt': {
                    async delete (path) {
                        deleted = path;
                    }
                },
                'mem': mstore
            });

            await hub.delete("/mnt/path/to/doc");
            expect(deleted).to.equal("/path/to/doc");                        

            await mstore.write("/path/to/doc", source);
            expect((await hub.read("/mem/path/to/doc")).source).to.equal(source);
            await hub.delete("/mem/path/to/doc");
            expect(await mstore.read("/path/to/doc")).to.equal("");
            expect((await hub.read("/mem/path/to/doc")).source).to.equal("");
        });
        
        it("should fail silentrly if the document or the store doesn't exist", async () => {
            var hub = new Hub({
                'mem': new MemoryStore()
            });            
            await hub.delete("/mem/path/to/doc");
            expect((await hub.read("/mem/path/to/doc")).source).to.equal("");
            expect((await hub.read("/nex/path/to/doc")).source).to.equal("");
        });
    });
        
    describe("Hub.prototype.mount(name, hub) - method", () => {
                
        it("shoul add an extra store to the hub", async () => {
            var hub = new Hub({
                'store1': new MemoryStore(),
                'store2': new MemoryStore(),
                'store3': new MemoryStore(),
            });
            hub.mount('store4', new MemoryStore());
            var rootDoc = await hub.read("/");
            var rootVal = await rootDoc.evaluate();
            expect(rootVal.items.sort()).to.deep.equal(["store1/", "store2/", "store3/", "store4/"])
        });
    });    
    
    describe("Hub.prototype.unmount(name) - method", () => {
        
        it("should remove a store from the hub", async () => {
            var hub = new Hub({
                'store1': new MemoryStore(),
                'store2': new MemoryStore(),
                'store3': new MemoryStore(),
            });
            hub.unmount('store2');
            var rootDoc = await hub.read("/");
            var rootVal = await rootDoc.evaluate();
            expect(rootVal.items.sort()).to.deep.equal(["store1/", "store3/"])
        });        
    });        
});
