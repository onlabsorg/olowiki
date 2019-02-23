// Run test:
// mocha -u tdd test/parser

const parser = require("../lib/parser");
const expect = require("chai").expect;
const stripIndent = require("strip-indent");



suite("parser", () => {
    
    test("parser.parse", () => {
        const obj = parser.parse(stripIndent(`
            num: 10
            str: "abc"
            map:
                x: 1
                y: 2
                z: 3
            seq: 
                - 10
                - 20
                - 30
            bool: true
        `));
        expect(obj).to.deep.equal({
            num: 10,
            str: "abc",
            map: {x:1, y:2, z:3},
            seq: [10,20,30],
            bool: true,
        });
    });
    
    test("parser.stringify", () => {
        const obj = {
            num: 10,
            str: "abc",
            map: {x:1, y:2, z:3},
            seq: [10,20,30]
        };
        const source = parser.stringify(obj);
        expect(parser.parse(source)).to.deep.equal(obj);
    });
    
    test("parser.Type", () => {
        const data = {};
        var type = new parser.Type(data);
        expect(type.data).to.equal(data);        
    });
    
    test("parser.ScalarType", () => {
        parser.types.set("!customtype", parser.ScalarType);
        var obj = parser.parse(`ct: !customtype "data content"`);
        expect(obj.ct).to.be.instanceof(parser.ScalarType);        
        expect(obj.ct.data).to.equal("data content");
    });
    
    test("parser.SequenceType", () => {
        parser.types.set("!customtype", parser.SequenceType);
        var obj = parser.parse(stripIndent(`
            ct: !customtype 
                - 10
                - 20
                - 30
        `));
        expect(obj.ct).to.be.instanceof(parser.SequenceType);        
        expect(obj.ct.data).to.deep.equal([10,20,30]);
    });
    
    test("parser.MappingType", () => {
        parser.types.set("!customtype", parser.MappingType);
        var obj = parser.parse(stripIndent(`
            ct: !customtype 
                x: 10
                y: 20
                z: 30
        `));
        expect(obj.ct).to.be.instanceof(parser.MappingType);        
        expect(obj.ct.data).to.deep.equal({x:10, y:20, z:30});
    });
});
