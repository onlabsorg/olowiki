const expect = require("chai").expect;
const Value = require("../../lib/olojs/value");

suite("olojs.Value", () => {

    test("Value.type(obj)", () => {
        expect(Value.type(undefined)).to.equal('Undefined');
        expect(Value.type(null)).to.equal('Null');
        expect(Value.type(true)).to.equal('Boolean');
        expect(Value.type(1)).to.equal('Number');
        expect(Value.type("abc")).to.equal('String');
        expect(Value.type({})).to.equal('Object');
        expect(Value.type([])).to.equal('Array');
        expect(Value.type(new Date())).to.equal('Date');
    });

    test("Value(obj)", () => {
        const val = Value({
            o: {a:1, b:2, o:{x:10, y:20}},
            a: [1, 2, undefined, {x:10, y:20}],
            s: "abc",
            n: null,
            b: true,
            d: new Date(100),
        });
        const expectedValue = {
            o: {a:1, b:2, o:{x:10, y:20}},
            a: {'0':1, '1':2, '3':{x:10, y:20}},
            s: "abc",
            n: null,
            b: true,
            d: new Date(100),
        }
        expect(val).to.deep.equal(expectedValue);
        expect(val).to.not.equal(expectedValue);
        expect(val.o).to.not.equal(expectedValue.o);
        expect(val.d).to.not.equal(expectedValue.d);
    });
});
