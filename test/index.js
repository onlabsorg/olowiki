
const expect = require("chai").expect;
const olojs = require("olojs");
const client = require("../lib/client");


// LocalStore test
require("./local-store");


// client test
describe("client", () => {
    var storedToken, testToken, userId;
    
    before(() => {
        storedToken = client.getToken();
        testToken = document.querySelector(`head meta[name="token"]`).getAttribute("content");
        client.setToken(testToken);
    });
    
    describe("client.getUser()", () => {
        it("should return the user identified by the stored token", async () => {
            userId = await client.getUser();
            expect(userId).to.equal("tester@onlabs.org");
        });
    });
    
    describe("client CRUD", () => {
        
        it("should perform CRUD operations on documents", async () => {
            var docPath = `/users/${userId}/testdoc`;
            
            await client.deleteResource(docPath);
            var doc = await client.readDocument(docPath);
            expect(doc.source).to.equal("");
            
            var docSource = "test document source";
            doc = client.createDocument(docPath, docSource);
            await client.writeDocument(doc);
            doc = await client.readDocument(docPath);
            expect(doc.source).to.equal(docSource);

            await client.deleteResource(docPath);
            doc = await client.readDocument(docPath);
            expect(doc.source).to.equal("");            
        });
        
        it("should perform CRUD operations on containers", async () => {
            var cPath = `/users/${userId}/testcont/`;
            
            await client.deleteResource(cPath);
            var cdoc = await client.readDocument(cPath);
            expect((await cdoc.evaluate()).items).to.deep.equal([]);
            
            await client.writeDocument( client.createDocument(`${cPath}doc1`, "...") );
            await client.writeDocument( client.createDocument(`${cPath}doc2`, "...") );
            await client.writeDocument( client.createDocument(`${cPath}doc3`, "...") );
            await client.writeDocument( client.createDocument(`${cPath}cnt1/doc4`, "...") );
            cdoc = await client.readDocument(cPath);
            expect((await cdoc.evaluate()).items).to.deep.equal(['cnt1/', 'doc1', 'doc2', 'doc3']);

            await client.deleteResource(cPath);
            cdoc = await client.readDocument(cPath);
            expect((await cdoc.evaluate()).items).to.deep.equal([]);
        });
    });
    
    after(() => {
        client.setToken(storedToken);
    });
});
