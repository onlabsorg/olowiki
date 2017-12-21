
const expect = require("chai").expect;
const Auth = require("../../lib/olojs/auth");
const errors = require("../../lib/olojs/errors");

suite("olojs.Auth", () => {

    test("new Auth(hash)", () => {
        expect(() => new Auth({})).to.not.throw();
    });

    test("Auth.prototype.pattern - getter", () => {
        var auth = new Auth({pattern:"/a/b/*"});
        expect(auth.pattern).to.equal("/a/b/*");

        auth = new Auth();
        expect(auth.pattern).to.equal("**");
    });

    test("Auth.prototype.permission - getter", () => {
        var auth = new Auth({permission:"admin"});
        expect(auth.permission).to.equal("admin");

        auth = new Auth({permission:"write"});
        expect(auth.permission).to.equal("write");

        auth = new Auth({permission:"read"});
        expect(auth.permission).to.equal("read");

        auth = new Auth({permission:"none"});
        expect(auth.permission).to.equal("none");

        auth = new Auth({});
        expect(auth.permission).to.equal("none");

        auth = new Auth({permission:"xxx"});
        expect(auth.permission).to.equal("none");
    });

    test("Auth.prototype.match(docPath)", () => {
        var auth = new Auth({pattern:"/a/b/*"});
        expect(auth.match("/a/b/c")).to.be.true;
        expect(auth.match("/a/x/c")).to.be.false;
    });

    test("Auth.prototype.canRead(docPath, subPath)", () => {
        var auth = new Auth({pattern:"/a/b/*", permission:"admin"});
        expect(auth.canRead("/a/b/c", "/x")).to.be.true;
        expect(auth.canRead("/a/x/c", "/x")).to.be.false;

        auth = new Auth({pattern:"/a/b/*", permission:"write"});
        expect(auth.canRead("/a/b/c", "/x")).to.be.true;
        expect(auth.canRead("/a/x/c", "/x")).to.be.false;

        auth = new Auth({pattern:"/a/b/*", permission:"read"});
        expect(auth.canRead("/a/b/c", "/x")).to.be.true;
        expect(auth.canRead("/a/x/c", "/x")).to.be.false;

        auth = new Auth({pattern:"/a/b/*", permission:"none"});
        expect(auth.canRead("/a/b/c", "/x")).to.be.false;
        expect(auth.canRead("/a/x/c", "/x")).to.be.false;
    });

    test("Auth.prototype.assertReadable(docPath, subPath)", () => {
        var auth = new Auth({pattern:"/a/b/*", permission:"admin"});
        expect(() => auth.assertReadable("/a/b/c", "/x")).to.not.throw();
        expect(() => auth.assertReadable("/a/x/c", "/x")).to.throw(errors.ReadPermissionError);

        auth = new Auth({pattern:"/a/b/*", permission:"write"});
        expect(() => auth.assertReadable("/a/b/c", "/x")).to.not.throw();
        expect(() => auth.assertReadable("/a/x/c", "/x")).to.throw(errors.ReadPermissionError);

        auth = new Auth({pattern:"/a/b/*", permission:"read"});
        expect(() => auth.assertReadable("/a/b/c", "/x")).to.not.throw();
        expect(() => auth.assertReadable("/a/x/c", "/x")).to.throw(errors.ReadPermissionError);

        auth = new Auth({pattern:"/a/b/*", permission:"none"});
        expect(() => auth.assertReadable("/a/b/c", "/x")).to.throw(errors.ReadPermissionError);
        expect(() => auth.assertReadable("/a/x/c", "/x")).to.throw(errors.ReadPermissionError);
    });

    test("Auth.prototype.canWrite(docPath, subPath)", () => {
        var auth = new Auth({pattern:"/a/b/*", permission:"admin"});
        expect(auth.canWrite("/a/b/c", "/x")).to.be.true;
        expect(auth.canWrite("/a/b/c", "/data/x")).to.be.true;
        expect(auth.canWrite("/a/x/c", "/data/x")).to.be.false;

        auth = new Auth({pattern:"/a/b/*", permission:"write"});
        expect(auth.canWrite("/a/b/c", "/x")).to.be.false;
        expect(auth.canWrite("/a/b/c", "/data/x")).to.be.true;
        expect(auth.canWrite("/a/x/c", "/data/x")).to.be.false;

        auth = new Auth({pattern:"/a/b/*", permission:"read"});
        expect(auth.canWrite("/a/b/c", "/x")).to.be.false;
        expect(auth.canWrite("/a/b/c", "/data/x")).to.be.false;
        expect(auth.canWrite("/a/x/c", "/data/x")).to.be.false;

        auth = new Auth({pattern:"/a/b/*", permission:"none"});
        expect(auth.canWrite("/a/b/c", "/x")).to.be.false;
        expect(auth.canWrite("/a/b/c", "/data/x")).to.be.false;
        expect(auth.canWrite("/a/x/c", "/data/x")).to.be.false;
    });

    test("Auth.prototype.assertWritable(docPath, subPath)", () => {
        var auth = new Auth({pattern:"/a/b/*", permission:"admin"});
        expect(() => auth.assertWritable("/a/b/c", "/x")).to.not.throw();
        expect(() => auth.assertWritable("/a/b/c", "/data/x")).to.not.throw();
        expect(() => auth.assertWritable("/a/x/c", "/data/x")).to.throw(errors.ReadPermissionError);

        auth = new Auth({pattern:"/a/b/*", permission:"write"});
        expect(() => auth.assertWritable("/a/b/c", "/x")).to.throw(errors.WritePermissionError);
        expect(() => auth.assertWritable("/a/b/c", "/data/x")).to.not.throw();
        expect(() => auth.assertWritable("/a/x/c", "/data/x")).to.throw(errors.ReadPermissionError);

        auth = new Auth({pattern:"/a/b/*", permission:"read"});
        expect(() => auth.assertWritable("/a/b/c", "/x")).to.throw(errors.WritePermissionError);
        expect(() => auth.assertWritable("/a/b/c", "/data/x")).to.throw(errors.WritePermissionError);
        expect(() => auth.assertWritable("/a/x/c", "/data/x")).to.throw(errors.ReadPermissionError);

        auth = new Auth({pattern:"/a/b/*", permission:"none"});
        expect(() => auth.assertWritable("/a/b/c", "/x")).to.throw(errors.ReadPermissionError);
        expect(() => auth.assertWritable("/a/b/c", "/data/x")).to.throw(errors.ReadPermissionError);
        expect(() => auth.assertWritable("/a/x/c", "/data/x")).to.throw(errors.ReadPermissionError);
    });

    test("Auth.prototype.toHash()", () => {
        var hash = {pattern:"/a/b/*", permission:"admin"};
        var auth = new Auth(hash);
        expect(auth.toHash()).to.deep.equal(hash);
    });

    test("Auth encode and decode", (done) => {
        const secret = "shhh";
        var hash = {pattern:"/a/b/*", permission:"admin"};

        var auth = new Auth(hash);
        var token = auth.encode(secret);
        expect(token).to.be.a("string");

        auth = Auth.decode(token, secret);
        expect(auth.toHash()).to.deep.equal(hash);

        expect(Auth.decode(token, "wrong-secret")).to.be.null;

        auth = new Auth(hash);
        token = auth.encode(secret, "5ms");
        setTimeout(() => {
            expect(Auth.decode(token, secret)).to.be.null;
            done();
        }, 10);
    });
});
