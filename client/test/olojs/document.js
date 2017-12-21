
const expect = require("chai").expect;
const Path = require("../../lib/olojs/path");
const Value = require("../../lib/olojs/value");
const Change = require("../../lib/olojs/change");
const Document = require("../../lib/olojs/document");
const errors = require("../../lib/olojs/errors");

const docHash = {
    committed: {
        x: 10,
        s: "abc",
        b: true,
        n: null,
        data: {
            y: 20,
            s: "def",
            b: false,
            n: null,
        }
    }
}


suite("olojs.Document", () => {

    test("new Document(docHash, options)", () => {
        expect(() => new Document()).to.not.throw(errors.ReadPermissionError);
    });

    test("Document.prototype.get(path)", () => {

        var doc = new Document(docHash);
        expect(doc.get('x')).to.equal(10);
        expect(doc.get('data')).to.deep.equal(docHash.committed.data);
        expect(doc.get('/data/n')).to.equal(null);
        expect(doc.get('/data/y')).to.equal(20);
        expect(doc.get('/data/s')).to.equal("def");
        expect(doc.get('/data/b')).to.be.false;
        expect(doc.get('/data/z')).to.be.undefined;
        expect(doc.get('/data/z/w')).to.be.undefined;

        // callback
        var cbPath;
        doc.beforeRead = path => {cbPath = String(path)};
        doc.get("/x/y/z");
        expect(cbPath).to.equal("/x/y/z");
    });

    test("Document.prototype.type(path)", () => {
        var doc = new Document(docHash);
        expect(doc.type('x')).to.equal('Number');
        expect(doc.type('data')).to.equal('Object');
        expect(doc.type('/data/n')).to.equal('Null');
        expect(doc.type('/data/y')).to.equal('Number');
        expect(doc.type('/data/s')).to.equal('String');
        expect(doc.type('/data/b')).to.equal('Boolean');
        expect(doc.type('/data/z')).to.equal('Undefined');
        expect(doc.type('/data/z/w')).to.equal('Undefined');

        // callback
        var cbPath;
        doc.beforeRead = path => {cbPath = String(path)};
        doc.type("/x/y/z");
        expect(cbPath).to.equal("/x/y/z");
    });

    test("Document.prototype.applyChanges(...changes)", () => {
        var doc = new Document({});

        doc.applyChanges(new Change("x", 10), new Change("y", 20));
        expect(doc.get("/")).to.deep.equal({x:10, y:20});

        doc.applyChanges(new Change("y", undefined), new Change("z", 30));
        expect(doc.get("/")).to.deep.equal({x:10, z:30});

        doc.applyChanges(new Change("/o/x", 10, 2000));
        expect(doc.get("/")).to.deep.equal({x:10, z:30});

        doc.applyChanges(new Change("/o", {}, 1000));
        expect(doc.get("/")).to.deep.equal({x:10, z:30, o:{x:10}});

        // callback
        var cbChange, timestamp = new Date();
        doc.beforeChange = change => {cbChange = change};
        doc.applyChanges(new Change("/x/y/z", 10, timestamp));
        expect(String(cbChange.path)).to.equal("/x/y/z");
        expect(cbChange.value).to.equal(10);
    });

    test("Document.prototype.set(path, value)", () => {
        const doc = new Document({});
        doc.set('x', 10);
        expect(doc.get('/')).to.deep.equal({x:10});
    });

    test("Document.prototype.delete(path)", () => {
        const doc = new Document({});
        doc.set('x', 10);
        doc.set('y', 20);
        doc.delete('x');
        expect(doc.get('/')).to.deep.equal({y:20});
    });

    test("Document.prototype.version - getter", () => {
        const doc = new Document({release:"1.2.3"});
        expect(doc.version).to.equal("1.2.3-pre.0");

        doc.set('/data/x', 10);
        doc.set('/data/y', 20);
        expect(doc.version).to.equal("1.2.3-pre.2");

        doc.delete('/data/y');
        expect(doc.version).to.equal("1.2.3-pre.3");
    });

    test("Document.prototype.commit(releaseType)", () => {
        var doc = new Document({
            committed: {
                data: {}
            },
            release:"0.0.0"
        });
        doc.set("/data/x", 10);
        doc.set("/data/y", 20);
        expect(doc.get('/data')).to.deep.equal({x:10, y:20});
        expect(doc.version).to.equal("0.0.0-pre.2");

        doc.commit("patch");
        expect(doc.get('/data')).to.deep.equal({x:10, y:20});
        expect(doc.version).to.equal("0.0.1-pre.0");

        doc.set("/data/z", 30);
        expect(doc.version).to.equal("0.0.1-pre.1");
        doc.commit("minor");
        expect(doc.get('/data')).to.deep.equal({x:10, y:20, z:30});
        expect(doc.version).to.equal("0.1.0-pre.0");

        doc.set("/data/w", 0);
        expect(doc.version).to.equal("0.1.0-pre.1");
        doc.commit("major");
        expect(doc.get('/data')).to.deep.equal({x:10, y:20, z:30, w:0});
        expect(doc.version).to.equal("1.0.0-pre.0");

        doc.set("/data/v", 1);
        expect(doc.version).to.equal("1.0.0-pre.1");
        doc.commit("xxx");
        expect(doc.version).to.equal("1.0.0-pre.1");

        // callback
        var cbRelease;
        doc.beforeCommit = releaseType => {cbRelease = releaseType};
        doc.commit("minor");
        expect(cbRelease).to.equal("minor");
    });

    test("Document.prototype.delta(version)", () => {
        var doc = new Document();

        const change1 = new Change('/data/x', 10);
        const change2 = new Change('/data/y', 20);
        const change3 = new Change('/data/z', 30);

        doc.applyChanges(change1);
        doc.commit('minor');
        const oldVersion = doc.version;

        doc.applyChanges(change2, change3);
        const delta = doc.delta(oldVersion);

        expect(delta).to.deep.equal([change2, change3]);

        // callback
        var cbPath;
        doc.beforeRead = path => {cbPath = String(path)};
        doc.delta("0.0.0");
        expect(cbPath).to.equal("/");
    });

    test("Document.prototype.toHash()", () => {
        const docHash = {
            committed: {
                head: {
                    users: {
                        user1: {
                            role: "admin",
                            email: "user1@onlabs.org"
                        },
                        user2: {
                            role: "reader",
                            email: "user2@onlabs.org"
                        },
                        user3: {
                            role: "reader",
                            email: "user3@onlabs.org"
                        }
                    }
                },
                body: {
                    n: null,
                    o: {x:10},
                    s: "abc"
                }
            },
            release: "1.0.0",
            changes: []
        }

        const doc = new Document(docHash);
        expect(doc.toHash()).to.deep.equal(docHash);
        expect(doc.toHash()).to.not.equal(docHash);

        // callback
        var cbPath;
        doc.beforeRead = path => {cbPath = String(path)};
        doc.toHash();
        expect(cbPath).to.equal("/");
    });

    test("Document.prototype.changeCallbacks - Set getter", () => {
        const doc = new Document({});

        var changes = null;
        function changeCallback (passedChanges) {
            changes = passedChanges.map(change => {return {path:String(change.path), value:change.value}})
        }
        doc.changeCallbacks.add(changeCallback);

        const ch1 = new Change('x', 11, 1000);
        const ch2 = new Change('y', 20, 3000);
        const ch3 = new Change('o', {}, 4000);
        const ch4 = new Change('/o/x', 10, 5000);

        doc.applyChanges(ch1, ch2);

        expect(changes).to.deep.equal([
            {path:'/x', value:11},
            {path:'/y', value:20},
        ]);

        changes = null;
        doc.applyChanges(ch4);
        expect(changes).to.be.null;

        doc.applyChanges(ch3);
        expect(changes).to.deep.equal([
            {path:'/o', value:{x:10}},
        ]);

        doc.changeCallbacks.delete(changeCallback);
        changes = null;
        doc.applyChanges(new Change('/o/z', 30, 10000));
        expect(changes).to.be.null;
    });
});
