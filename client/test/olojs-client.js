
// testing olojs.Path
require("./olojs/path");


// testing olojs.Value
require("./olojs/value");


// testing olojs.Change
require("./olojs/change");


// testing olojs.Document
require("./olojs/document");


// testing olojs.HTTPStore
const Document = require("../lib/olojs/document");
const {HTTPStore} = require("../lib/olojs/store-client");

const store = new HTTPStore('/store');

async function writeFile (path, text) {
    const response = await fetch(`/fs${path}`, {
        method: "PUT",
        headers: new Headers({
            'Content-Type': "text/plain",
            'X-Requested-With': "XMLHttpRequest",
        }),
        body: text
    });

    switch (response.status) {

        case 200:
            return;

        default:
            let errorMessage = await response.text();
            throw new Error(errorMessage);
    }
}

async function fileExists (path) {
    const response = await fetch(`/test/olojs/store${path}`);
    switch (response.status) {
        case 200:
            return true;
        case 404:
            return false;
        default:
            let errorMessage = await response.text();
            throw new Error(errorMessage);
    }
}

async function deleteFile (path) {
    const response = await fetch(`/fs${path}`, {
        method: "DELETE",
        headers: new Headers({
            'X-Requested-With': "XMLHttpRequest",
        })
    });

    switch (response.status) {

        case 200:
            return;

        default:
            let errorMessage = await response.text();
            throw new Error(errorMessage);
    }
}

const testStore = require("./olojs/store");
testStore('HTTPStore', store, writeFile, fileExists, deleteFile);



// testing olojs.RemoteDocument
const expect = require("chai").expect;
const YAML = require('js-yaml');
const {Client} = require("../lib/olojs/store-client");

const testDocPath = `/test-doc.yaml`;

const testDocHash = {

    committed: {
        head: {
            users: {
                Admin: {role:'admin'},
                Writer: {role:'writer'},
                Reader: {role:'reader'},
                Guest: {role:'guest'},
            }
        },
        body: {a:10, b:20, c:30}
    },

    owner: 'Owner',

    release: "0.1.0",

    changes: []
}

suite("olojs.Client", () => {

    test("new Client(store, auth)", () => {
        const client = new Client(store, 'root');
        expect(client.store).to.equal(store);
        expect(client.auth).to.equal('root');
    });

    test("Client.prototype.loadDocument(path) - async method", (done) => {
        async function test () {
            await writeFile(testDocPath, YAML.dump(testDocHash));
            const client = new Client(store, 'root');
            const doc = await client.loadDocument(testDocPath);
            expect(doc).to.be.instanceof(Document);
            expect(doc.toHash()).to.deep.equal(testDocHash);

            // doc.store() - async method
            doc.set('/body/pi', 3.14);
            await doc.store();
            const storedDoc = await client.loadDocument(testDocPath);
            expect(storedDoc.get('/body/pi')).to.equal(3.14);
            expect(storedDoc.toHash()).to.deep.equal(doc.toHash());
            expect(storedDoc.version).to.equal(doc.version);

            // doc.sync() - async method
            await writeFile(testDocPath, YAML.dump(testDocHash));
            var doc1 = await client.loadDocument(testDocPath);
            var doc2 = await client.loadDocument(testDocPath);
            doc2.set('/body/x', 100);
            await doc2.store();
            doc1.set('/body/y', 200);
            await doc1.sync();
            expect(doc1.get('/body/x')).to.equal(100);
            expect(doc1.get('/body/y')).to.equal(200);
            expect(doc1.version).to.equal('0.1.0-pre.2');
            doc2 = await client.loadDocument(testDocPath);
            expect(doc2.get('/body/x')).to.equal(100);
            expect(doc2.get('/body/y')).to.equal(200);
            expect(doc2.version).to.equal('0.1.0-pre.2');

            await writeFile(testDocPath, YAML.dump(testDocHash));
            doc1 = await client.loadDocument(testDocPath);
            doc2 = await client.loadDocument(testDocPath);
            doc2.set('/body/x', 100);
            await doc2.store();
            await doc1.sync();
            expect(doc1.get('/body/x')).to.equal(100);
            expect(doc1.version).to.equal('0.1.0-pre.1');
            doc2 = await client.loadDocument(testDocPath);
            expect(doc2.get('/body/x')).to.equal(100);
            expect(doc2.version).to.equal('0.1.0-pre.1');

            await writeFile(testDocPath, YAML.dump(testDocHash));
            doc1 = await client.loadDocument(testDocPath);
            doc1.set('/body/x', 100);
            await doc1.sync();
            doc2 = await client.loadDocument(testDocPath);
            expect(doc2.get('/body/x')).to.equal(100);
            expect(doc2.version).to.equal('0.1.0-pre.1');
        }
        test().then(done).catch(done);
    });

    test("Client.prototype.storeDocument(path, doc) - async method", (done) => {
        async function test () {
            await writeFile(testDocPath, YAML.dump(testDocHash));
            const client = new Client(store, 'root');
            const doc = await client.loadDocument(testDocPath);

            doc.set('/body/pi', 3.14);
            await client.storeDocument(testDocPath, doc);
            const storedDoc = await client.loadDocument(testDocPath);
            expect(storedDoc.get('/body/pi')).to.equal(3.14);
            expect(storedDoc.toHash()).to.deep.equal(doc.toHash());

            const newDocPath = '/new-test-doc.yaml';
            expect(await fileExists(newDocPath)).to.be.false;
            await client.storeDocument(newDocPath, doc);
            expect(await fileExists(newDocPath)).to.be.true;
            const newDoc = await client.loadDocument(newDocPath);
            expect(newDoc.toHash()).to.deep.equal(doc.toHash());
            await deleteFile(newDocPath);
        };
        test().then(done).catch(done);
    });

    test("Client.prototype.deleteDocument(path) - async method", (done) => {
        async function test () {
            await writeFile(testDocPath, YAML.dump(testDocHash));
            const client = new Client(store, 'root');
            const doc = await client.loadDocument(testDocPath);

            const newDocPath = '/new-test-doc.yaml';
            await client.storeDocument(newDocPath, doc);
            expect(await fileExists(newDocPath)).to.be.true;
            await client.deleteDocument(newDocPath);
            expect(await fileExists(newDocPath)).to.be.false;
        };
        test().then(done).catch(done);
    });
});
