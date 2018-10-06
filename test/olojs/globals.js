// Run test:
// mocha -u tdd test/olojs/globals

const globals = require("../../lib/olojs/globals");
const expect = require("chai").expect;


suite("globals", () => {
    
    test("E", () => {
        expect(globals.E).to.equal(Math.E);
    });

    test("PI", () => {
        expect(globals.PI).to.equal(Math.PI);
    });
    
    
    
    test("degrees", () => {
        expect(globals.degrees(Math.PI/4)).to.equal(45);
    });

    test("radians", () => {
        expect(globals.radians(45)).to.equal(Math.PI/4);
    });



    test("sin", () => {
        expect(globals.sin(0.5)).to.equal(Math.sin(0.5));
    });
    
    test("asin", () => {
        expect(globals.asin(0.5)).to.equal(Math.asin(0.5));
    });
    
    test("cos", () => {
        expect(globals.cos(0.5)).to.equal(Math.cos(0.5));
    });

    test("acos", () => {
        expect(globals.acos(0.5)).to.equal(Math.acos(0.5));
    });

    test("tan", () => {
        expect(globals.tan(0.5)).to.equal(Math.tan(0.5));
    });

    test("atan", () => {
        expect(globals.atan(0.5)).to.equal(Math.atan(0.5));
    });



    test("sinh", () => {
        expect(globals.sinh(0.5)).to.equal(Math.sinh(0.5));
    });
    
    test("asinh", () => {
        expect(globals.asinh(0.5)).to.equal(Math.asinh(0.5));
    });
    
    test("cosh", () => {
        expect(globals.cosh(0.5)).to.equal(Math.cosh(0.5));
    });

    test("acosh", () => {
        expect(globals.acosh(1.1)).to.equal(Math.acosh(1.1));
    });

    test("tanh", () => {
        expect(globals.tanh(0.5)).to.equal(Math.tanh(0.5));
    });

    test("atanh", () => {
        expect(globals.atanh(0.5)).to.equal(Math.atanh(0.5));
    });
    

    
    test("abs", () => {
        expect(globals.abs(-2.1)).to.equal(2.1);
    });
    
    test("ceil", () => {
        expect(globals.ceil(1.2)).to.equal(2);
    });
    
    test("floor", () => {
        expect(globals.floor(2.1)).to.equal(2);
    });

    test("round", () => {
        expect(globals.round(2.1)).to.equal(2);
        expect(globals.round(2.7)).to.equal(3);
    });
    


    test("exp", () => {
        expect(globals.exp(0.5)).to.equal(Math.exp(0.5));
    });
    
    test("log", () => {
        expect(globals.log(0.5)).to.equal(Math.log(0.5));
    });
    
    test("log10", () => {
        expect(globals.log10(0.5)).to.equal(Math.log10(0.5));
    });
    

    
    test("max", () => {
        expect(globals.max(0.5, 11, 4)).to.equal(11);
    });
    
    test("min", () => {
        expect(globals.min(0.5, 11, 4)).to.equal(0.5);
    });
    
    test("pow", () => {
        expect(globals.pow(7, 2.5)).to.equal(7**2.5);
    });

    test("random", () => {
        const r1 = globals.random();
        const r2 = globals.random();    
        expect(r1).to.not.equal(r2);
        expect(0 <= r1 && r1 <= 1).to.be.true;
    });

    test("sqrt", () => {
        expect(globals.sqrt(2)).to.equal(2**0.5);
    });
});
