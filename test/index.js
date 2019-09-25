
const expect = require("chai").expect;
const Path = require("path");
const olojs = require("olojs");
const client = require("../lib/client");



describe("olojs", () => {
    require("olojs/test/document");
    require("olojs/test/expression");
    require("olojs/test/flat-store");
    require("olojs/test/hub");
});


// LocalStore test
require("./local-store");


// client test
describe("client", () => {
    var storedToken, testToken, userId, userPath;
    
    before(async () => {
        storedToken = client.getToken();
        userId = await client.getUser();
        userPath = `/users/${userId}/olowiki-test`;

        const response = await fetch("/test/init-tester-store", {
            method: 'post',
            headers: {
                'Authorization': `Bearer ${storedToken}`,
            },
            body: JSON.stringify({
                "/path/to/doc1"             : "doc1 body",
                "/path/to/doc2"             : "doc2 body",
                "/path/to/doc3"             : "doc3 body",
                "/path/to/container1/doc4"  : "doc4 body",
                "/path/to/container2/doc5"  : "doc5 body",
                "/path/TO/doc6"             : "doc6 body",
                "/a/b/c/doc7"               : "doc7 body"
            })
        });
        
        if (response.status !== 200) {
            let message = await response.text();
            throw new Error(message);
        }
        
    });
    
    describe(`client.read(documentPath) - async method`, () => {
        
        it("should return the document stored at the given path", async () => {
            var doc = await client.read(`${userPath}/path/to/doc1`);
            expect(doc).to.be.instanceof(olojs.Document);
            expect(doc.uri).to.be.instanceof(olojs.URI);
            expect(String(doc.uri)).to.equal((new URL(`${userPath}/path/to/doc1`, location.href)).href);
            expect(doc.body).to.equal("doc1 body");
        });

        it("should return an empty string if the path doesn't exist", async () => {
            var doc = await client.read(`${userPath}/path/to/doc111`);
            expect(doc).to.be.instanceof(olojs.Document);
            expect(doc.body).to.equal("");            
        });
    });        

    describe(`client.read(containerPath) - async method`, () => {

        it("should return a document body defining the child 'items' and 'subPaths' list of the container", async () => {
            var doc = await client.read(`${userPath}/path/to/`);
            expect(doc).to.be.instanceof(olojs.Document);
            var context = doc.createContext();
            var docVal = await doc.evaluate(context);

            expect(docVal.items).to.be.an("array");
            expect(docVal.items.sort()).to.deep.equal([
                "container1/",
                "container2/",
                "doc1",
                "doc2",
                "doc3",
            ]);

            expect(docVal.subPaths).to.be.an("array");
            expect(docVal.subPaths.sort()).to.deep.equal([
                "container1/doc4",
                "container2/doc5",
                "doc1",
                "doc2",
                "doc3",
            ]);
        });

        it("should return a document body defining empty 'items' and 'subPaths' lists if the path doesn't exist", async () => {
            var doc = await client.read(`${userPath}/path/to/non-existing/container/`);
            expect(doc).to.be.instanceof(olojs.Document);
            var context = doc.createContext();
            var docVal = await doc.evaluate(context);
            
            expect(docVal.items).to.be.an("array");
            expect(docVal.items.sort()).to.deep.equal([]);

            expect(docVal.subPaths).to.be.an("array");
            expect(docVal.subPaths.sort()).to.deep.equal([]);
        });            
    });

    describe(`client.write(documentPath, body) - async method`, () => {
    
        it("should map the passed document body to the passed path", async () => {
            var docContent = "doc11 body";
            await client.write(`${userPath}/path/to/doc11`, docContent);
            var doc = await client.read(`${userPath}/path/to/doc11`);
            expect(doc).to.be.instanceof(olojs.Document);
            expect(doc.body).to.equal(docContent);
            
            var containerDoc = await client.read(`${userPath}/path/to/`);
            var context = containerDoc.createContext();
            var docVal = await containerDoc.evaluate(context);    
            expect(docVal.subPaths.sort()).to.deep.equal([
                "container1/doc4",
                "container2/doc5",
                "doc1",
                "doc11",
                "doc2",
                "doc3",
            ]);
        });
        
        it("should create the intermediate containers if they don't exist", async () => {
            var docContent = "doc12 body";
            await client.write(`${userPath}/path/to/container3/container4/doc12`, docContent);
            var doc = await client.read(`${userPath}/path/to/container3/container4/doc12`);
            expect(doc).to.be.instanceof(olojs.Document);
            expect(doc.body).to.equal(docContent);
            
            var containerDoc = await client.read(`${userPath}/path/to/`);
            var context = containerDoc.createContext();
            var docVal = await doc.evaluate(context);    
            expect(docVal.subPaths.sort()).to.deep.equal([
                "container1/doc4",
                "container2/doc5",
                "container3/container4/doc12",
                "doc1",
                "doc11",
                "doc2",
                "doc3",
            ]);
        });
    });

    describe(`client.write(containerPath, body) - async method`, () => {
        
        it("should throw a WriteOperationNotAllowed", async () => {
            try {
                await client.write(`${userPath}/path/to/container1/`, {
                    'doc41': "doc41 body",
                    'container5/doc51': "doc51 body"
                });
                throw new Error("It didn't throw.")
            } catch (error) {
                expect(error).to.be.instanceof(olojs.errors.WriteOperationNotAllowed);
            }
        });
    });
    
    describe(`client.delete(documentPath) - async method`, () => {

        it("should remove the document at the given path", async () => {    
            var doc = await client.read(`${userPath}/path/to/doc11`);
            expect(doc.body).to.equal("doc11 body");
            
            await client.delete(`${userPath}/path/to/doc11`);
            var doc = await client.read(`${userPath}/path/to/doc11`);
            expect(doc.body).to.equal("");
            
            var containerDoc = await client.read(`${userPath}/path/to/`);
            var context = containerDoc.createContext();
            var docVal = await containerDoc.evaluate(context);    
            expect(docVal.subPaths.sort()).to.deep.equal([
                "container1/doc4",
                "container2/doc5",
                "container3/container4/doc12",
                "doc1",
                "doc2",
                "doc3",
            ]);                
        });

        it("should fail silentrly if the document doesn't exist", async () => {
            var doc = await client.read(`${userPath}/path/to/doc11`);
            expect(doc.body).to.equal("");
            
            await client.delete(`${userPath}/path/to/doc11`);
            var doc = await client.read(`${userPath}/path/to/doc11`);
            expect(doc.body).to.equal("");
            
            var containerDoc = await client.read(`${userPath}/path/to/`);
            var context = containerDoc.createContext();
            var docVal = await containerDoc.evaluate(context);    
            expect(docVal.subPaths.sort()).to.deep.equal([
                "container1/doc4",
                "container2/doc5",
                "container3/container4/doc12",
                "doc1",
                "doc2",
                "doc3",
            ]);                
        });            

        it("should remove also the container if it become empty", async () => {    
            var doc = await client.read(`${userPath}/path/to/container3/container4/doc12`);
            expect(doc.body).to.equal("doc12 body");
            
            await client.delete(`${userPath}/path/to/container3/container4/doc12`);
            var doc = await client.read(`${userPath}/path/to/container3/container4/doc12`);
            expect(doc.body).to.equal("");
            
            var containerDoc = await client.read(`${userPath}/path/to/`);
            var context = containerDoc.createContext();
            var docVal = await containerDoc.evaluate(context);    
            expect(docVal.subPaths.sort()).to.deep.equal([
                "container1/doc4",
                "container2/doc5",
                "doc1",
                "doc2",
                "doc3",
            ]);                
        });

    });
    
    describe(`client.delete(containerPath) - async method`, () => {
        
        it("should remove the given container and its content", async () => {
            await client.write(`${userPath}/path/to/container1/doc41`, "doc41 body");
            await client.write(`${userPath}/path/to/container1/doc42`, "doc42 body");
            
            // verify current situation
            var containerDoc = await client.read(`${userPath}/path/to/`);
            var context = containerDoc.createContext();
            var docVal = await containerDoc.evaluate(context);    
            expect(docVal.subPaths.sort()).to.deep.equal([
                "container1/doc4",
                "container1/doc41",
                "container1/doc42",
                "container2/doc5",
                "doc1",
                "doc2",
                "doc3",
            ]);                

            // delete container1
            await client.delete(`${userPath}/path/to/container1/`);

            var containerDoc = await client.read(`${userPath}/path/to/`);
            var context = containerDoc.createContext();
            var docVal = await containerDoc.evaluate(context);    
            expect(docVal.subPaths.sort()).to.deep.equal([
                "container2/doc5",
                "doc1",
                "doc2",
                "doc3",
            ]);                
        });

        it("should fail silently if the the given path doesn't exist", async () => {
            
            // verify current situation
            var containerDoc = await client.read(`${userPath}/path/to/`);
            var context = containerDoc.createContext();
            var docVal = await containerDoc.evaluate(context);    
            expect(docVal.subPaths.sort()).to.deep.equal([
                "container2/doc5",
                "doc1",
                "doc2",
                "doc3",
            ]);                

            // delete container1
            await client.delete(`${userPath}/path/to/container1/`);

            var containerDoc = await client.read(`${userPath}/path/to/`);
            var context = containerDoc.createContext();
            var docVal = await containerDoc.evaluate(context);    
            expect(docVal.subPaths.sort()).to.deep.equal([
                "container2/doc5",
                "doc1",
                "doc2",
                "doc3",
            ]);                
        });
    });
    
    describe("client access control", () => {
        before(() => {
            client.setToken("");            
        });

        it("should allow to read read-only documents", async () => {
            var doc = await client.read(`${userPath}/path/to/doc1`);
            expect(doc).to.be.instanceof(olojs.Document);
            expect(doc.uri).to.be.instanceof(olojs.URI);
            expect(String(doc.uri)).to.equal((new URL(`${userPath}/path/to/doc1`, location.href)).href);
            expect(doc.body).to.equal("doc1 body");
        });
        
        it("should allow to read read-only containers", async () => {
            var doc = await client.read(`${userPath}/path/to/`);
            expect(doc).to.be.instanceof(olojs.Document);
            var context = doc.createContext();
            var docVal = await doc.evaluate(context);

            expect(docVal.subPaths).to.be.an("array");
            expect(docVal.subPaths.sort()).to.deep.equal([
                "container2/doc5",
                "doc1",
                "doc2",
                "doc3",
            ]);
        });    
        
        it("should throw a WriteAccessDenied error when trying to write to a read-only document", async () => {
            try {
                await client.write(`${userPath}/path/to/container1/doc100`, "doc100 body");
                throw new Error("It didn't throw.")
            } catch (error) {
                expect(error).to.be.instanceof(olojs.errors.WriteAccessDenied);
            }
        });        
        
        it("should throw a WriteOperationNotAllowed error when trying to write to a container", async () => {
            try {
                await client.write(`${userPath}/path/to/container1/`, {
                    'doc41': "doc41 body",
                    'container5/doc51': "doc51 body"
                });
                throw new Error("It didn't throw.")
            } catch (error) {
                expect(error).to.be.instanceof(olojs.errors.WriteOperationNotAllowed);
            }
        });        
        
        it("should throw a WriteAccessDenied error when trying to delete a read-only document", async () => {
            try {
                await client.delete(`${userPath}/path/to/container1/doc100`);
                throw new Error("It didn't throw.")
            } catch (error) {
                expect(error).to.be.instanceof(olojs.errors.WriteAccessDenied);
            }
        });        
        
        it("should throw a WriteAccessDenied error when trying to delete a read-only container", async () => {
            try {
                await client.delete(`${userPath}/path/to/`);
                throw new Error("It didn't throw.")
            } catch (error) {
                expect(error).to.be.instanceof(olojs.errors.WriteAccessDenied);
            }
        });        
        
        after(() => {
            client.setToken(testToken);
        });        
    });
        
    after(() => {
        client.setToken(storedToken);
    });
});


// BinStore test
require("./bin-store");
