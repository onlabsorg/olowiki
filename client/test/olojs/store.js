

const expect = require("chai").expect;
const YAML = require('js-yaml');

const errors = require("../../lib/olojs/errors");
const Change = require("../../lib/olojs/change");
const Document = require("../../lib/olojs/document");

const testDocPath = `/test-doc.yaml`;

const testDocHash = {

    committed: {
        data: {a:10, b:20, c:30}
    },

    release: "0.1.0",

    changes: []
}


module.exports = function (storeClassName, store, writeFile, fileExists, deleteFile, Auth) {

    suite(`olojs.${storeClassName}`, () => {

        test(`${storeClassName}.prototype.readDocument(docPath) - async method`, (done) => {
            async function test () {
                await writeFile(testDocPath, YAML.dump(testDocHash));

                // admin auth
                var doc = await store.readDocument(testDocPath, Auth({pattern:"**", permission:"admin"}));
                expect(doc).to.be.instanceof(Document);
                expect(doc.toHash()).to.deep.equal(testDocHash);

                // write auth
                doc = await store.readDocument(testDocPath, Auth({pattern:"**", permission:"write"}));
                expect(doc).to.be.instanceof(Document);
                expect(doc.toHash()).to.deep.equal(testDocHash);

                // read auth
                doc = await store.readDocument(testDocPath, Auth({pattern:"**", permission:"read"}));
                expect(doc).to.be.instanceof(Document);
                expect(doc.toHash()).to.deep.equal(testDocHash);

                // no auth
                var error;
                try {
                    doc = await store.readDocument(testDocPath, Auth({pattern:"**", permission:"none"}));
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.instanceof(errors.ReadPermissionError);

                // non-authorized path
                var error;
                try {
                    doc = await store.readDocument(testDocPath, Auth({pattern:"/ns/*", permission:"admin"}));
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.instanceof(errors.ReadPermissionError);

                // non-existing document
                var error;
                try {
                    doc = await store.readDocument('/non-existing-doc.yaml', Auth({pattern:"**", permission:"admin"}));
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.instanceof(errors.DocumentNotFoundError);
            }
            test().then(done).catch(done);
        });

        test(`${storeClassName}.prototype.writeDocument(docPath, doc) - async method`, (done) => {
            async function test () {
                await writeFile(testDocPath, YAML.dump(testDocHash));

                var newDoc = new Document(testDocHash);
                var newDocPath = '/new-test-doc.yaml';
                expect(await fileExists(newDocPath)).to.be.false;

                // admin auth
                var auth = Auth({pattern:"**", permission:"admin"});
                var doc = await store.readDocument(testDocPath, auth);
                doc.set('/data/pi', 3.14);
                await store.writeDocument(testDocPath, doc, auth);
                doc = await store.readDocument(testDocPath, auth);
                expect(doc.get('/data/pi')).to.equal(3.14);

                expect(await fileExists(newDocPath)).to.be.false;
                newDoc = new Document(testDocHash);
                await store.writeDocument(newDocPath, newDoc, auth);
                expect(await fileExists(newDocPath)).to.be.true;
                newDoc = await store.readDocument(newDocPath, auth);
                expect(newDoc.toHash()).to.deep.equal(testDocHash);

                await deleteFile(newDocPath);

                // write auth
                auth = Auth({pattern:"**", permission:"write"});
                var error;
                try {
                    await store.writeDocument(newDocPath, newDoc, auth);
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.instanceof(errors.WritePermissionError);
                expect(await fileExists(newDocPath)).to.be.false;

                // read auth
                auth = Auth({pattern:"**", permission:"read"});
                var error;
                try {
                    await store.writeDocument(newDocPath, newDoc, auth);
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.instanceof(errors.WritePermissionError);
                expect(await fileExists(newDocPath)).to.be.false;

                // non-authorized path
                auth = Auth({pattern:"/ns/*", permission:"admin"});
                var error;
                try {
                    await store.writeDocument(newDocPath, newDoc, auth);
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.instanceof(errors.ReadPermissionError);
                expect(await fileExists(newDocPath)).to.be.false;
            }
            test().then(done).catch(done);
        });

        test(`${storeClassName}.prototype.updateDocument(docPath, sinceVersion, changes) - async method`, (done) => {
            async function test () {

                // admin auth
                var auth = Auth({pattern:"**", permission:"admin"});
                await writeFile(testDocPath, YAML.dump(testDocHash));
                var doc = await store.readDocument(testDocPath, auth);
                var sinceVersion = doc.version;

                const change1 = new Change('/x', 11);
                const change2 = new Change('/data/x', 12);
                var missingChanges = await store.updateDocument(testDocPath, sinceVersion, [change1, change2], auth);
                expect(missingChanges).to.deep.equal([]);

                const change3 = new Change('/y', 21);
                const change4 = new Change('/data/y', 22);
                missingChanges = await store.updateDocument(testDocPath, sinceVersion, [change3, change4], auth);
                expect(missingChanges.length).to.equal(2);
                expect(missingChanges[0].toHash()).to.deep.equal(change1.toHash());
                expect(missingChanges[1].toHash()).to.deep.equal(change2.toHash());

                doc = await store.readDocument(testDocPath, auth);
                expect(doc.get('/x')).to.equal(11);
                expect(doc.get('/data/x')).to.equal(12);
                expect(doc.get('/y')).to.equal(21);
                expect(doc.get('/data/y')).to.equal(22);

                error = null;
                try {
                    await store.updateDocument('/non-existing-document.yaml', sinceVersion, [change1], auth);
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.instanceof(errors.DocumentNotFoundError);

                // write auth
                auth = Auth({pattern:"**", permission:"write"});
                await writeFile(testDocPath, YAML.dump(testDocHash));
                doc = await store.readDocument(testDocPath, auth);
                sinceVersion = doc.version;

                var change = new Change('/data/x', 12);
                missingChanges = await store.updateDocument(testDocPath, sinceVersion, [change], auth);
                doc = await store.readDocument(testDocPath, auth);
                expect(doc.get('/data/x')).to.equal(12);

                change = new Change('/x', 11);
                error = null;
                try {
                    await store.updateDocument(testDocPath, sinceVersion, [change], auth);
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.instanceof(errors.WritePermissionError);

                // read auth
                auth = Auth({pattern:"**", permission:"read"});
                await writeFile(testDocPath, YAML.dump(testDocHash));
                doc = await store.readDocument(testDocPath, auth);
                sinceVersion = doc.version;

                change = new Change('/data/x', 12);
                error = null;
                try {
                    await store.updateDocument(testDocPath, sinceVersion, [change], auth);
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.instanceof(errors.WritePermissionError);
            }
            test().then(done).catch(done);
        });

        test(`${storeClassName}.prototype.deleteDocument(docPath) - async method`, (done) => {
            async function test () {

                // admin auth
                var auth = Auth({pattern:"**", permission:"admin"});
                expect(await fileExists(testDocPath)).to.be.true;
                await store.deleteDocument(testDocPath, auth);
                expect(await fileExists(testDocPath)).to.be.false;

                var error = null;
                try {
                    await store.deleteDocument(testDocPath, auth);
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.instanceof(errors.DocumentNotFoundError);
                expect(await fileExists(testDocPath)).to.be.false;
                await writeFile(testDocPath, YAML.dump(testDocHash));

                // write auth
                auth = Auth({pattern:"**", permission:"write"});
                var error = null;
                try {
                    await store.deleteDocument(testDocPath, auth);
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.instanceof(errors.WritePermissionError);

                // read auth
                auth = Auth({pattern:"**", permission:"read"});
                var error = null;
                try {
                    await store.deleteDocument(testDocPath, auth);
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.instanceof(errors.WritePermissionError);

                // non-authorized path
                auth = Auth({pattern:"/ns/*", permission:"admin"});
                var error = null;
                try {
                    await store.deleteDocument(testDocPath, auth);
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.instanceof(errors.ReadPermissionError);
            }
            test().then(done).catch(done);
        });
    });
}
