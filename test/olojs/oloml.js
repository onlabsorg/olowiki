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
        const context = {};
        parser.registerType("!customtype", oloml.ScalarType, context);
        const obj = parser.parse(`ct: !customtype "data content"`);
        expect(obj.ct).to.be.instanceof(oloml.ScalarType);
        expect(obj.ct.context).to.equal(context);
    });
    
    test("OLOML.Type", () => {
        const data = {};
        const context = {};
        var type = new oloml.Type(data, context);
        expect(type.data).to.equal(data);
        expect(type.context).to.equal(context);    
        
        var type = new oloml.Type(data, () => context);
        expect(type.context).to.equal(context);
        
        class Context {}
        var type = new oloml.Type(data, Context);
        expect(type.context).to.be.instanceof(Context);
    });
    
    test("OLOML.ScalarType", () => {
        const parser = new oloml.Parser();
        const context = {};
        parser.registerType("!customtype", oloml.ScalarType, context);
        var obj = parser.parse(`ct: !customtype "data content"`);
        expect(obj.ct).to.be.instanceof(oloml.ScalarType);        
        expect(obj.ct.data).to.equal("data content");
        expect(obj.ct.context).to.equal(context);

        parser.registerType("!customtype", oloml.ScalarType, () => context);
        obj = parser.parse(`ct: !customtype "data content"`);
        expect(obj.ct.context).to.equal(context);

        class Context {}
        parser.registerType("!customtype", oloml.ScalarType, Context);
        obj = parser.parse(`ct: !customtype "data content"`);
        expect(obj.ct.context).to.be.instanceof(Context);
    });
    
    test("OLOML.SequenceType", () => {
        const parser = new oloml.Parser();
        const context = {};
        parser.registerType("!customtype", oloml.SequenceType, context);
        var obj = parser.parse(stripIndent(`
            ct: !customtype 
                - 10
                - 20
                - 30
        `));
        expect(obj.ct).to.be.instanceof(oloml.SequenceType);        
        expect(obj.ct.data).to.deep.equal([10,20,30]);
        expect(obj.ct.context).to.equal(context);        

        parser.registerType("!customtype", oloml.SequenceType, () => context);
        obj = parser.parse(stripIndent(`ct: !customtype [10, 20, 30]`));
        expect(obj.ct.context).to.equal(context);        

        class Context {}
        parser.registerType("!customtype", oloml.SequenceType, Context);
        obj = parser.parse(stripIndent(`ct: !customtype [10, 20, 30]`));
        expect(obj.ct.context).to.be.instanceof(Context);
    });
    
    test("OLOML.MappingType", () => {
        const parser = new oloml.Parser();
        const context = {};
        parser.registerType("!customtype", oloml.MappingType, context);
        var obj = parser.parse(stripIndent(`
            ct: !customtype 
                x: 10
                y: 20
                z: 30
        `));
        expect(obj.ct).to.be.instanceof(oloml.MappingType);        
        expect(obj.ct.data).to.deep.equal({x:10, y:20, z:30});
        expect(obj.ct.context).to.equal(context);                

        parser.registerType("!customtype", oloml.MappingType, () => context);
        obj = parser.parse(stripIndent(`ct: !customtype {x:10, y:20, z:30}`));
        expect(obj.ct.context).to.equal(context);        

        class Context {}
        parser.registerType("!customtype", oloml.MappingType, Context);
        obj = parser.parse(stripIndent(`ct: !customtype {x:10, y:20, z:30}`));
        expect(obj.ct.context).to.be.instanceof(Context);

    });
});
