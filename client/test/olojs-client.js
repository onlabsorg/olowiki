
// testing olojs.Path
require("./olojs/path");


// testing olojs.Value
require("./olojs/value");


// testing olojs.Change
require("./olojs/change");


// testing olojs.Document
require("./olojs/document");


// testing olojs.Auth
require("./olojs/auth");


// testing olojs.HTTPStore
const Document = require("../lib/olojs/document");
const {Store} = require("../lib/olojs/store-client");

const store = new Store('/store');

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

const Auth = require("../lib/olojs/auth")
const secret = "test-jwt-key";
const Token = hash => (new Auth(hash)).encode(secret);

const testStore = require("./olojs/store");
testStore('HTTPStore', store, writeFile, fileExists, deleteFile, Token);



// testing olojs.RemoteDocument
const expect = require("chai").expect;
const YAML = require('js-yaml');
const {RemoteDocument} = require("../lib/olojs/store-client");
const errors = require("../lib/olojs/errors");

const testDocPath = `/test-doc.yaml`;

const testDocHash = {

    committed: {
        x: 10,
        b: true,
        s: "abc",
        n: null,
    },

    release: "0.1.0",

    changes: []
}

suite("olojs.RemoteDocument", () => {

    test("Local operations access control", (done) => {
        async function test () {
            var doc, error;

            // admin permission
            await writeFile(testDocPath, YAML.dump(testDocHash));
            doc = await RemoteDocument(store, testDocPath, Token({permission:'admin'}));
            expect(() => doc.get('/x')).to.not.throw();
            expect(() => doc.set('/x', 11)).to.not.throw();
            expect(() => doc.set('/y', 20)).to.not.throw();

            // try {
            //     await doc.sync();
            //     error = null;
            // } catch (e) {
            //     error = e;
            // }
            // expect(error).to.be.null;

            // write permission
            await writeFile(testDocPath, YAML.dump(testDocHash));
            doc = await RemoteDocument(store, testDocPath, Token({permission:'write'}));
            expect(() => doc.get('/x')).to.not.throw();
            expect(() => doc.set('/x', 11)).to.not.throw();
            expect(() => doc.set('/y', 20)).to.not.throw();

            // read permission
            await writeFile(testDocPath, YAML.dump(testDocHash));
            doc = await RemoteDocument(store, testDocPath, Token({permission:'read'}));
            expect(() => doc.get('/x')).to.not.throw();
            expect(() => doc.set('/x', 11)).to.throw(errors.WritePermissionError);
            expect(() => doc.set('/y', 20)).to.throw(errors.WritePermissionError);

            // no permission
            await writeFile(testDocPath, YAML.dump(testDocHash));
            try {
                doc = await RemoteDocument(store, testDocPath, Token({permission:'none'}));
                error = null;
            } catch (e) {
                error = e;
            }
            expect(error).to.be.instanceof(errors.ReadPermissionError);
        }
        test().then(done).catch(done);
    });

    test("RemoteDocument(store, auth, authToken) - async factory", (done) => {
        async function test () {
            await writeFile(testDocPath, YAML.dump(testDocHash));
            const doc = await RemoteDocument(store, testDocPath, Token({permission:'admin'}));
            expect(doc).to.be.instanceof(Document);
            expect(doc.toHash()).to.deep.equal(testDocHash);
        }
        test().then(done).catch(done);
    });

    test("RemoteDocument instance 'save' method", (done) => {
        async function test () {
            var doc, error;

            // admin permission
            await writeFile(testDocPath, YAML.dump(testDocHash));
            doc = await RemoteDocument(store, testDocPath, Token({permission:'admin'}));
            doc.set('/pi', 3.14);
            await doc.save();
            const storedDoc = await RemoteDocument(store, testDocPath, Token({permission:'admin'}));
            expect(storedDoc.get('/pi')).to.equal(3.14);
            expect(storedDoc.toHash()).to.deep.equal(doc.toHash());
            expect(storedDoc.version).to.equal(doc.version);

            // write permission
            await writeFile(testDocPath, YAML.dump(testDocHash));
            doc = await RemoteDocument(store, testDocPath, Token({permission:'write'}));
            try {
                await doc.save();
                error = null;
            } catch (e) {
                error = e;
            }
            expect(error).to.be.instanceof(errors.AdminPermissionError);

            // read permission
            await writeFile(testDocPath, YAML.dump(testDocHash));
            doc = await RemoteDocument(store, testDocPath, Token({permission:'read'}));
            try {
                await doc.save();
                error = null;
            } catch (e) {
                error = e;
            }
            expect(error).to.be.instanceof(errors.AdminPermissionError);
        }
        test().then(done).catch(done);
    });

    test("RemoteDocument instance 'sync' method", (done) => {
        async function test () {
            var doc, doc1, doc2, error;

            // admin permission
            await writeFile(testDocPath, YAML.dump(testDocHash));
            doc1 = await RemoteDocument(store, testDocPath, Token({permission:'admin'}));
            doc2 = await RemoteDocument(store, testDocPath, Token({permission:'admin'}));
            doc2.set('/x', 100);
            await doc2.save();
            doc1.set('/y', 200);
            await doc1.sync();
            expect(doc1.get('/x')).to.equal(100);
            expect(doc1.get('/y')).to.equal(200);
            expect(doc1.version).to.equal('0.1.0-pre.2');
            doc2 = await RemoteDocument(store, testDocPath, Token({permission:'admin'}));
            expect(doc2.get('/x')).to.equal(100);
            expect(doc2.get('/y')).to.equal(200);
            expect(doc2.version).to.equal('0.1.0-pre.2');

            await writeFile(testDocPath, YAML.dump(testDocHash));
            doc1 = await RemoteDocument(store, testDocPath, Token({permission:'admin'}));
            doc2 = await RemoteDocument(store, testDocPath, Token({permission:'admin'}));
            doc2.set('/x', 100);
            await doc2.save();
            await doc1.sync();
            expect(doc1.get('/x')).to.equal(100);
            expect(doc1.version).to.equal('0.1.0-pre.1');
            doc2 = await RemoteDocument(store, testDocPath, Token({permission:'admin'}));
            expect(doc2.get('/x')).to.equal(100);
            expect(doc2.version).to.equal('0.1.0-pre.1');

            await writeFile(testDocPath, YAML.dump(testDocHash));
            doc1 = await RemoteDocument(store, testDocPath, Token({permission:'admin'}));
            doc1.set('/x', 100);
            await doc1.sync();
            doc2 = await RemoteDocument(store, testDocPath, Token({permission:'admin'}));
            expect(doc2.get('/x')).to.equal(100);
            expect(doc2.version).to.equal('0.1.0-pre.1');

            // write permission
            await writeFile(testDocPath, YAML.dump(testDocHash));
            doc = await RemoteDocument(store, testDocPath, Token({permission:'write'}));
            try {
                await doc.sync();
                error = null;
            } catch (e) {
                error = e;
            }
            expect(error).to.be.null;

            // read permission
            await writeFile(testDocPath, YAML.dump(testDocHash));
            doc = await RemoteDocument(store, testDocPath, Token({permission:'read'}));
            try {
                await doc.sync();
                error = null;
            } catch (e) {
                error = e;
            }
            expect(error).to.be.instanceof(errors.WritePermissionError);
        }
        test().then(done).catch(done);
    });

    test("RemoteDocument instance 'share' method", (done) => {
        async function test () {
            var doc, error, token;

            // admin permission
            await writeFile(testDocPath, YAML.dump(testDocHash));
            doc = await RemoteDocument(store, testDocPath, Token({permission:'admin'}));
            token = await doc.share("user@host", "write", "1y");
            const qAuth = Auth.decode(token, secret);
            expect(qAuth.user).to.equal("user@host");
            expect(qAuth.permission).to.equal("write");
            expect(qAuth.pattern).to.equal(testDocPath);

            // expired permission
            token = await doc.share("user@host", "write", "1ms");
            await new Promise((resolve, reject) => {
                setTimeout(resolve, 2);
            });
            expect(Auth.decode(token, secret)).to.be.null;

            // write permission
            doc = await RemoteDocument(store, testDocPath, Token({permission:'write'}));
            try {
                await doc.share("user@host", "write", "1y");
                error = null;
            } catch (e) {
                error = e;
            }
            expect(error).to.be.instanceof(errors.AdminPermissionError);
        }
        test().then(done).catch(done);
    });
});
