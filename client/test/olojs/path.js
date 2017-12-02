
const expect = require("chai").expect;
const Path = require("../../lib/olojs/path");

suite("olojs.Path", () => {

    test("new Path(...items)", () => {
        const path = new Path("a", "b", "c", {toString: () => "d"});
        expect(path).to.be.instanceof(Array);
        expect(path).to.deep.equal(['a', 'b', 'c', 'd']);
    });

    test("Path.prototype.leaf - getter", () => {
        var path = new Path("a", "b", "c");
        expect(path.leaf).to.equal("c");

        path = new Path();
        expect(path.leaf).to.be.undefined;
    });

    test("Path.prototype.parent - getter", () => {
        var path = new Path("a", "b", "c");
        expect(path.parent).to.be.instanceof(Path);
        expect(path.parent).to.deep.equal(['a', 'b']);

        path = new Path();
        expect(path.parent).to.be.null;
    });

    test("Path.prototype.lookup(obj)", () => {

        var obj = {'a': {'b': {'c':1} } }
        expect( (new Path('a','b')).lookup(obj) ).to.deep.equal(obj.a.b);
        expect( (new Path('a','b','c')).lookup(obj) ).to.equal(obj.a.b.c);

        obj = {'a': {'b': {'c':1} } }
        expect( (new Path('a.b.x')).lookup(obj) ).to.be.undefined;
        expect( (new Path('a.b.c.x')).lookup(obj) ).to.be.undefined;
    });

    test("Path.prototype.match(pattern)", () => {
        const path = new Path('a','b','c');
        expect(path.match("/a/b/c")).to.be.true;
        expect(path.match("/a/*/c")).to.be.true;
        expect(path.match("/a/*/c/d")).to.be.false;
    });

    test("Path.prototype.toString()", () => {
        var path = new Path("a", "b", "c");
        expect(String(path)).to.equal("/a/b/c");

        path = new Path();
        expect(String(path)).to.equal("/");
    });

    test("Path.parse(...subPaths)", () => {

        var path = Path.parse("/a/b/c");
        expect(path).to.be.instanceof(Path);
        expect(path).to.deep.equal(['a','b','c'])

        path = Path.parse(path, "d/e", 'f', ['g','h']);
        expect(path).to.be.instanceof(Path);
        expect(path).to.deep.equal(['a','b','c','d','e','f','g','h']);

        path = Path.parse("a/b///c", "", 'd', null, undefined);
        expect(path).to.be.instanceof(Path);
        expect(path).to.deep.equal(['a','b','c','d']);
    });
});
