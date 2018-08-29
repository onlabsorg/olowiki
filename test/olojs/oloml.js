// Run test:
// mocha -u tdd test/olojs/oloml

const oloml = require("../../lib/olojs/oloml");
const expect = require("chai").expect;
const stripIndent = require("strip-indent");



suite("OLOML", () => {
    
    test("OLOML.Parser.constructor", () => {
        const parser = new oloml.Parser();
        expect(parser.parse).to.be.a("function");
        expect(parser.stringify).to.be.a("function");
        expect(parser.registerType).to.be.a("function");
    });
    
    test("OLOML.Parser.prototype.parse", () => {
        const parser = new oloml.Parser();
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
    
    test("OLOML.Parser.prototype.stringify", () => {
        const parser = new oloml.Parser();
        const obj = {
            num: 10,
            str: "abc",
            map: {x:1, y:2, z:3},
            seq: [10,20,30]
        };
        const source = parser.stringify(obj);
        expect(parser.parse(source)).to.deep.equal(obj);
    });
    
    test("OLOML.Parser.prototype.registerType", () => {
        const parser = new oloml.Parser();
        const options = {};
        parser.registerType("!customtype", oloml.ScalarType, options);
        const obj = parser.parse(`ct: !customtype "data content"`);
        expect(obj.ct).to.be.instanceof(oloml.ScalarType);
        expect(obj.ct.options).to.equal(options);
    });
    
    test("OLOML.Type", () => {
        const data = {};
        const options = {};
        var type = new oloml.Type(data, options);
        expect(type.data).to.equal(data);
        expect(type.options).to.equal(options);    
    
        const contextPrototype = {};
        const self = {};
        const context = type.Context(contextPrototype, self, "a", "b", "c");
        expect(Object.getPrototypeOf(context)).to.equal(contextPrototype);
        expect(context.$0).to.equal(self);    
        expect(context.$1).to.equal("a");    
        expect(context.$2).to.equal("b");    
        expect(context.$3).to.equal("c");    
        expect(context.$4).to.be.undefined;
    });
    
    test("OLOML.ScalarType", () => {
        const parser = new oloml.Parser();
        const options = {};
        parser.registerType("!customtype", oloml.ScalarType, options);
        const obj = parser.parse(`ct: !customtype "data content"`);
        expect(obj.ct).to.be.instanceof(oloml.ScalarType);        
        expect(obj.ct.data).to.equal("data content");
        expect(obj.ct.options).to.equal(options);
    });
    
    test("OLOML.SequenceType", () => {
        const parser = new oloml.Parser();
        const options = {};
        parser.registerType("!customtype", oloml.SequenceType, options);
        const obj = parser.parse(stripIndent(`
            ct: !customtype 
                - 10
                - 20
                - 30
        `));
        expect(obj.ct).to.be.instanceof(oloml.SequenceType);        
        expect(obj.ct.data).to.deep.equal([10,20,30]);
        expect(obj.ct.options).to.equal(options);        
    });
    
    test("OLOML.MappingType", () => {
        const parser = new oloml.Parser();
        const options = {};
        parser.registerType("!customtype", oloml.MappingType, options);
        const obj = parser.parse(stripIndent(`
            ct: !customtype 
                x: 10
                y: 20
                z: 30
        `));
        expect(obj.ct).to.be.instanceof(oloml.MappingType);        
        expect(obj.ct.data).to.deep.equal({x:10, y:20, z:30});
        expect(obj.ct.options).to.equal(options);                
    });
});
