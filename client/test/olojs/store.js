

const expect = require("chai").expect;
const YAML = require('js-yaml');

const errors = require("../../lib/olojs/errors");
const Change = require("../../lib/olojs/change");
const Document = require("../../lib/olojs/document");

const testDocPath = `/test-doc.yaml`;

const testDocHash = {

    committed: {
        users: {
            Admin: {role:'admin'},
            Writer: {role:'writer'},
            Reader: {role:'reader'},
            Guest: {role:'guest'},
        },
        data: {a:10, b:20, c:30}
    },

    owner: 'Owner',

    release: "0.1.0",

    changes: []
}


module.exports = function (storeClassName, store, writeFile, fileExists, deleteFile) {

    suite(`olojs.${storeClassName}`, () => {

        test(`${storeClassName}.prototype.readDocument(docPath, userName) - async method`, (done) => {
            async function test () {
                await writeFile(testDocPath, YAML.dump(testDocHash));

                var doc = await store.readDocument(testDocPath, 'root');
                expect(doc).to.be.instanceof(Document);
                expect(doc.toHash()).to.deep.equal(testDocHash);

                doc = await store.readDocument(testDocPath, 'Owner');
                expect(doc.toHash()).to.deep.equal(testDocHash);

                doc = await store.readDocument(testDocPath, 'Admin');
                expect(doc.toHash()).to.deep.equal(testDocHash);

                doc = await store.readDocument(testDocPath, 'Writer');
                expect(doc.toHash()).to.deep.equal(testDocHash);

                doc = await store.readDocument(testDocPath, 'Reader');
                expect(doc.toHash()).to.deep.equal(testDocHash);

                var error;
                try {
                    doc = await store.readDocument(testDocPath, 'Guest');
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.instanceof(errors.ReadPermissionError);

                var error;
                try {
                    doc = await store.readDocument('/non-existing-doc.yaml', 'root');
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.instanceof(errors.DocumentNotFoundError);
            }
            test().then(done).catch(done);
        });

        test(`${storeClassName}.prototype.writeDocument(docPath, doc, userName) - async method`, (done) => {
            async function test () {
                await writeFile(testDocPath, YAML.dump(testDocHash));
                var doc = await store.readDocument(testDocPath, 'root');

                doc.set('/data/pi', 3.14);
                doc.commit();
                await store.writeDocument(testDocPath, doc, 'root');
                doc = await store.readDocument(testDocPath, 'root');
                expect(doc.get('/data/pi')).to.equal(3.14);
                var docHash = doc.toHash();
                delete docHash.committed.data.pi;
                docHash.release = testDocHash.release;
                expect(docHash).to.deep.equal(testDocHash);


                // permissions
                var error = null;
                try {
                    await store.writeDocument(testDocPath, doc, 'Owner');
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.null;

                error = null;
                try {
                    await store.writeDocument(testDocPath, doc, 'Admin');
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.instanceof(errors.WritePermissionError);

                error = null;
                try {
                    await store.writeDocument(testDocPath, doc, 'Writer');
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.instanceof(errors.WritePermissionError);

                error = null;
                try {
                    await store.writeDocument(testDocPath, doc, 'Reader');
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.instanceof(errors.WritePermissionError);


                // create new documents
                var newDoc = new Document(testDocHash);
                var newDocPath = '/new-test-doc.yaml';
                expect(await fileExists(newDocPath)).to.be.false;
                await store.writeDocument(newDocPath, newDoc, 'root');
                expect(await fileExists(newDocPath)).to.be.true;
                newDoc = await store.readDocument(newDocPath, 'root');
                expect(newDoc.toHash()).to.deep.equal(testDocHash);
                await deleteFile(newDocPath);

                var error = null;
                expect(await fileExists(newDocPath)).to.be.false;
                try {
                    await store.writeDocument(newDocPath, newDoc, 'root');
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.null;
                await deleteFile(newDocPath);

                error = null;
                expect(await fileExists(newDocPath)).to.be.false;
                try {
                    await store.writeDocument(newDocPath, newDoc, 'Owner');
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.instanceof(errors.WritePermissionError);

                error = null;
                expect(await fileExists(newDocPath)).to.be.false;
                try {
                    await store.writeDocument(newDocPath, newDoc, 'Admin');
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.instanceof(errors.WritePermissionError);

                error = null;
                expect(await fileExists(newDocPath)).to.be.false;
                try {
                    await store.writeDocument(newDocPath, newDoc, 'Writer');
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.instanceof(errors.WritePermissionError);

                error = null;
                expect(await fileExists(newDocPath)).to.be.false;
                try {
                    await store.writeDocument(newDocPath, newDoc, 'Reader');
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.instanceof(errors.WritePermissionError);

                if (store.canCreate) {
                    store.canCreate = async function (path, userName) {
                        return userName === 'root' || userName === 'Owner';
                    }
                    var error = null;
                    expect(await fileExists(newDocPath)).to.be.false;
                    try {
                        await store.writeDocument(newDocPath, newDoc, 'Owner');
                    } catch (e) {
                        error = e;
                    }
                    expect(error).to.be.null;
                    await deleteFile(newDocPath);
                }
            }
            test().then(done).catch(done);
        });

        test(`${storeClassName}.prototype.updateDocument(docPath, sinceVersion, changes, userName) - async method`, (done) => {
            async function test () {
                await writeFile(testDocPath, YAML.dump(testDocHash));
                var doc = await store.readDocument(testDocPath, 'root');
                var sinceVersion = doc.version;

                const change1 = new Change('/x', 11);
                const change2 = new Change('/data/x', 12);
                var missingChanges = await store.updateDocument(testDocPath, sinceVersion, [change1, change2], 'root');
                expect(missingChanges).to.deep.equal([]);

                const change3 = new Change('/y', 21);
                const change4 = new Change('/data/y', 22);
                missingChanges = await store.updateDocument(testDocPath, sinceVersion, [change3, change4], 'root');
                expect(missingChanges.length).to.equal(2);
                expect(missingChanges[0].toHash()).to.deep.equal(change1.toHash());
                expect(missingChanges[1].toHash()).to.deep.equal(change2.toHash());

                doc = await store.readDocument(testDocPath, 'root');
                expect(doc.get('/x')).to.equal(11);
                expect(doc.get('/data/x')).to.equal(12);
                expect(doc.get('/y')).to.equal(21);
                expect(doc.get('/data/y')).to.equal(22);


                // permissions

                var error = null;
                try {
                    await store.updateDocument(testDocPath, sinceVersion, [change1, change2], 'Owner');
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.null;

                error = null;
                try {
                    await store.updateDocument(testDocPath, sinceVersion, [change1, change2], 'Admin');
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.null;

                error = null;
                try {
                    await store.updateDocument(testDocPath, sinceVersion, [change2], 'Writer');
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.null;

                error = null;
                try {
                    await store.updateDocument(testDocPath, sinceVersion, [change1], 'Writer');
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.instanceof(errors.UpdatePermissionError);

                error = null;
                try {
                    await store.updateDocument(testDocPath, sinceVersion, [change2], 'Reader');
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.instanceof(errors.UpdatePermissionError);

                error = null;
                try {
                    await store.updateDocument(testDocPath, sinceVersion, [change1], 'Reader');
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.instanceof(errors.UpdatePermissionError);


                // non-existing document

                error = null;
                try {
                    await store.updateDocument('/non-existing-document.yaml', sinceVersion, [change1], 'root');
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.instanceof(errors.DocumentNotFoundError);
            }
            test().then(done).catch(done);
        });

        test(`${storeClassName}.prototype.deleteDocument(docPath, userName) - async method`, (done) => {
            async function test () {
                await store.deleteDocument(testDocPath, 'root');
                expect(await fileExists(testDocPath)).to.be.false;

                var error = null;
                try {
                    await store.deleteDocument(testDocPath, 'root');
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.instanceof(errors.DocumentNotFoundError);

                await writeFile(testDocPath, YAML.dump(testDocHash));

                var error = null;
                try {
                    await store.deleteDocument(testDocPath, 'Owner');
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.null;

                await writeFile(testDocPath, YAML.dump(testDocHash));

                var error = null;
                try {
                    await store.deleteDocument(testDocPath, 'Admin');
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.instanceof(errors.WritePermissionError);
                expect(await fileExists(testDocPath)).to.be.true;

                var error = null;
                try {
                    await store.deleteDocument(testDocPath, 'Writer');
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.instanceof(errors.WritePermissionError);
                expect(await fileExists(testDocPath)).to.be.true;

                var error = null;
                try {
                    await store.deleteDocument(testDocPath, 'Reader');
                } catch (e) {
                    error = e;
                }
                expect(error).to.be.instanceof(errors.WritePermissionError);
                expect(await fileExists(testDocPath)).to.be.true;
            }
            test().then(done).catch(done);
        });
    });
}
