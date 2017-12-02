const expect = require("chai").expect;
const Path = require("../../lib/olojs/path");
const Value = require("../../lib/olojs/value");
const Change = require("../../lib/olojs/change");

function wait (delay) {
    const t0 = Date.now();
    while (Date.now() - t0 < delay) {}
}

suite("olojs.Change", () => {

    test("new Change(path, value)", () => {
        const timestamp = new Date();
        var change = new Change('/a/b/c', [10, 11, 12], timestamp);
        expect(change.path).to.be.instanceof(Path);
        expect(String(change.path)).to.equal('/a/b/c');
        expect(change.value).to.deep.equal({'0':10, '1':11, '2':12});
        expect(change.timestamp).to.be.instanceof(Date);
        expect(change.timestamp.toISOString()).to.equal(timestamp.toISOString());

        change = new Change('/', 10, timestamp.toISOString());
        expect(change.timestamp).to.be.instanceof(Date);
        expect(change.timestamp.toISOString()).to.equal(timestamp.toISOString());

        change = new Change('/', 10, 1000);
        expect(change.timestamp).to.be.instanceof(Date);
        expect(change.timestamp.toISOString()).to.equal((new Date(1000)).toISOString());

        var change1 = new Change('/a/b/c', 1);
        wait(10);
        var change2 = new Change('/a/b/c', 2);
        expect(change2.timestamp > change1.timestamp).to.be.true;
    });

    test("Change.prototype.getSuperChange(path)", () => {
        const change = new Change('/d/e/f', {a:1,b:2}, new Date());
        const superChange = change.getSuperChange('/a/b/c');
        expect(String(superChange.path)).to.equal('/a/b/c/d/e/f');
        expect(superChange.value).to.deep.equal(change.value);
        expect(superChange.value).to.not.equal(change.value);
        expect(superChange.timestamp.toISOString()).to.equal(change.timestamp.toISOString());
    });

    test("Change.prototype.getSubChange(paht)", () => {
        var changeValue = {d:{e:{f:{g:9.81}}}};
        var change = new Change('/a/b/c', changeValue, 1000);

        var subChange = change.getSubChange('/a/b/c');
        expect(subChange.path).to.deep.equal([]);
        expect(subChange.value).to.deep.equal(changeValue);
        expect(subChange.timestamp.toISOString()).to.equal(change.timestamp.toISOString());

        subChange = change.getSubChange('/a');
        expect(subChange.path).to.deep.equal(['b', 'c']);
        expect(subChange.value).to.deep.equal(changeValue);
        expect(subChange.timestamp.toISOString()).to.equal(change.timestamp.toISOString());

        subChange = change.getSubChange('/a/b/c/d/e');
        expect(subChange.path).to.deep.equal([]);
        expect(subChange.value).to.deep.equal(changeValue.d.e);
        expect(subChange.timestamp.toISOString()).to.equal(change.timestamp.toISOString());

        subChange = change.getSubChange('/a/b/c/d/x/y');
        expect(subChange.path).to.deep.equal([]);
        expect(subChange.value).to.be.undefined;
        expect(subChange.timestamp.toISOString()).to.equal(change.timestamp.toISOString());

        subChange = change.getSubChange('/a/x/y');
        expect(subChange).to.be.null;
    });

    test("Change.prototype.apply(obj)", () => {
        var change = new Change('/a/b', {c:10});
        var obj = {a:{b:1}};
        change.apply(obj);
        expect(obj).to.deep.equal({a:{b:{c:10}}});
        expect(obj.a.b).to.not.equal(change.value);

        var change = new Change('/a/b', {c:10});
        var obj = {x:10};
        change.apply(obj);
        expect(obj).to.deep.equal({x:10});
    });

    test("Change.prototype.toHash()", () => {
        const change = new Change('/d/e/f', {a:1,b:2}, new Date());
        const hash = change.toHash();
        expect(hash.path).to.equal(String(change.path));
        expect(hash.value).to.deep.equal(change.value);
        expect(hash.value).to.not.equal(change.value);
        expect(hash.timestamp).to.equal(change.timestamp.toISOString());
    });

    test("Change.diff(val1, val2)", () => {
        var changes;

        // primitive values diff
        changes = Change.diff(10, 20);
        expect(changes.length).to.equal(1);
        expect(String(changes[0].path)).to.equal('/');
        expect(changes[0].value).to.equal(20);

        changes = Change.diff(10, 10);
        expect(changes.length).to.equal(0);

        // different types diff
        changes = Change.diff(null, 10);
        expect(changes.length).to.equal(1);
        expect(String(changes[0].path)).to.equal('/');
        expect(changes[0].value).to.equal(10);

        changes = Change.diff({}, 10);
        expect(changes.length).to.equal(1);
        expect(String(changes[0].path)).to.equal('/');
        expect(changes[0].value).to.equal(10);

        changes = Change.diff(10, null);
        expect(changes.length).to.equal(1);
        expect(String(changes[0].path)).to.equal('/');
        expect(changes[0].value).to.equal(null);

        changes = Change.diff(10, {});
        expect(changes.length).to.equal(1);
        expect(String(changes[0].path)).to.equal('/');
        expect(changes[0].value).to.deep.equal({});

        // map deep diff
        changes = Change.diff({a:1, b:2}, {a:1, b:3});
        expect(changes.length).to.equal(1);
        expect(String(changes[0].path)).to.equal('/b');
        expect(changes[0].value).to.equal(3);

        changes = Change.diff({a:1, b:2}, {a:1});
        expect(changes.length).to.equal(1);
        expect(String(changes[0].path)).to.equal('/b');
        expect(changes[0].value).to.equal(undefined);

        changes = Change.diff({o:{a:1, b:2}}, {o:{a:1, b:3}});
        expect(changes.length).to.equal(1);
        expect(String(changes[0].path)).to.equal('/o/b');
        expect(changes[0].value).to.equal(3);

        // array diff
        changes = Change.diff(null, [10, 11]);
        expect(changes.length).to.equal(1);
        expect(String(changes[0].path)).to.equal('/');
        expect(changes[0].value).to.deep.equal({'0':10, '1':11});

        changes = Change.diff([10, 11], [10, 12]);
        expect(changes.length).to.equal(1);
        expect(String(changes[0].path)).to.equal('/1');
        expect(changes[0].value).to.equal(12);
    });

    test("Change.sort(...changes)", () => {
        const ch1 = new Change('/a', 10, 1000);
        const ch2 = new Change('/b', 20, 2000);
        const ch3 = new Change('/c', 30, 3000);
        const ch4 = "not a change object: to be discarded";
        const ch5_a = new Change('/d', 51, 5000);
        const ch5_b = new Change('/d', 52, 5000);
        const ch6 = new Change('/e', 60, 6000);
        const ch7 = new Change('/f', 70, 7000);
        const ch8 = new Change('/g', 80, 8000);
        const ch9 = new Change('/h', 90, 9000);

        expect(Change.sort(ch4, ch9, ch8, ch1, ch5_a, ch5_b, ch6, ch7, ch3, ch2)).to.deep.equal([ch1, ch2, ch3, ch5_a, ch5_b, ch6, ch7, ch8, ch9]);
    });

    test("Change.digest(base, ...changes)", () => {
        const obj = {
            o: {x:10, y:20, z:30},
            s: "abc",
            n: 10
        };
        const ch1 = new Change('/o/x', 11, 1000);
        const ch2 = new Change('/o/x', 12, 2000);
        const ch3 = new Change('/s', "def", 3000);
        const ch4 = "not a change object: to be discarded";
        const ch5_a = new Change('/pi', 3, 5000);
        const ch5_b = new Change('/pi', 3.14, 5000);
        const ch6 = new Change('/o/w/g', 9.81, 6000);
        const ch7 = new Change('/n', undefined, 7000);
        const ch8 = new Change('/o2', {}, 8000);
        const ch9 = new Change('/o2/x', 10, 9000);

        const expectedDigest = {
            o: {x:12, y:20, z:30},
            s: "def",
            pi: 3.14,
            o2: {x:10}
        }

        // changes ordered by date
        var digest = Change.digest(obj, ch1, ch2, ch3, ch4, ch5_a, ch5_b, ch6, ch7, ch8, ch9);
        expect(digest).to.not.equal(obj);
        expect(digest).to.deep.equal(expectedDigest);

        // mixed timestamps
        var digest = Change.digest(obj, ch3, ch2, ch1, ch6, ch5_a, ch5_b, ch4, ch7, ch9, ch8);
        expect(digest).to.not.equal(obj);
        expect(digest).to.deep.equal(expectedDigest);

        // same timestamp handling
        var digest = Change.digest(obj, ch1, ch2, ch3, ch4, ch5_b, ch5_a, ch6, ch7, ch8, ch9);
        expect(digest.pi).to.equal(3);

        // changes ordering do no affect the original change array
        const changes = [ch3, ch2, ch1, ch6, ch5_a, ch5_b, ch4, ch7, ch9, ch8];
        Change.digest(obj, ...changes);
        expect(changes).to.deep.equal([ch3, ch2, ch1, ch6, ch5_a, ch5_b, ch4, ch7, ch9, ch8]);
    });
});
