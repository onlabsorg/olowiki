// Run test:
// mocha -u tdd test/olojs/oloxp

const expect = require("chai").expect;

const parser = require("../lib/xp-parser");
const Expression = require("../lib/expression");


suite("Expression", () => {
    
    test("+ operator", (done) => {
        async function runtest () {
            const expression = new Expression("10+1");
            const val = await expression.evaluate();
            expect(val).to.equal(11);            
        }
        runtest().then(done).catch(err => done(err));
    });    

    test("- operator", (done) => {
        async function runtest () {
            const expression = new Expression("10-1");
            const val = await expression.evaluate();
            expect(val).to.equal(9);            
        }
        runtest().then(done).catch(err => done(err));
    });    

    test("* operator", (done) => {
        async function runtest () {
            const expression = new Expression("10*2");
            const val = await expression.evaluate();
            expect(val).to.equal(20);            
        }
        runtest().then(done).catch(err => done(err));
    });    

    test("/ operator", (done) => {
        async function runtest () {
            const expression = new Expression("10/2");
            const val = await expression.evaluate();
            expect(val).to.equal(5);            
        }
        runtest().then(done).catch(err => done(err));
    });    

    test("'mod' operator", (done) => {
        async function runtest () {
            const expression = new Expression("11 mod 3");
            const val = await expression.evaluate();
            expect(val).to.equal(2);            
        }
        runtest().then(done).catch(err => done(err));
    });    
    
    test("^ operator", (done) => {
        async function runtest () {
            const expression = new Expression("10^2");
            const val = await expression.evaluate();
            expect(val).to.equal(100);            
        }
        runtest().then(done).catch(err => done(err));
    });    
        
    test("== operator", (done) => {
        async function runtest () {
            var expression = new Expression("10 == 2");
            var val = await expression.evaluate();
            expect(val).to.equal(false);

            expression = new Expression("10 == 10");
            val = await expression.evaluate();
            expect(val).to.equal(true);
        }
        runtest().then(done).catch(err => done(err));
    });    
    
    test("!= operator", (done) => {
        async function runtest () {
            var expression = new Expression("10 != 2");
            var val = await expression.evaluate();
            expect(val).to.equal(true);

            expression = new Expression("10 != 10");
            val = await expression.evaluate();
            expect(val).to.equal(false);
        }
        runtest().then(done).catch(err => done(err));
    });    

    test("> operator", (done) => {
        async function runtest () {
            var val1 = await (new Expression("10 > 2")).evaluate();
            var val2 = await (new Expression("2 > 10")).evaluate();
            var val3 = await (new Expression("10 > 10")).evaluate();
            
            expect(val1).to.equal(true);
            expect(val2).to.equal(false);
            expect(val3).to.equal(false);
        }
        runtest().then(done).catch(err => done(err));
    });    

    test("< operator", (done) => {
        async function runtest () {
            var val1 = await (new Expression("10 < 2")).evaluate();
            var val2 = await (new Expression("2 < 10")).evaluate();
            var val3 = await (new Expression("10 < 10")).evaluate();
            
            expect(val1).to.equal(false);
            expect(val2).to.equal(true);
            expect(val3).to.equal(false);
        }
        runtest().then(done).catch(err => done(err));
    });    
    
    test(">= operator", (done) => {
        async function runtest () {
            var val1 = await (new Expression("10 >= 2")).evaluate();
            var val2 = await (new Expression("2 >= 10")).evaluate();
            var val3 = await (new Expression("10 >= 10")).evaluate();
            
            expect(val1).to.equal(true);
            expect(val2).to.equal(false);
            expect(val3).to.equal(true);
        }
        runtest().then(done).catch(err => done(err));
    });    

    test("<= operator", (done) => {
        async function runtest () {
            var val1 = await (new Expression("10 <= 2")).evaluate();
            var val2 = await (new Expression("2 <= 10")).evaluate();
            var val3 = await (new Expression("10 <= 10")).evaluate();
            
            expect(val1).to.equal(false);
            expect(val2).to.equal(true);
            expect(val3).to.equal(true);
        }
        runtest().then(done).catch(err => done(err));
    });    

    test("'or' operator", (done) => {
        async function runtest () {
            var val1 = await (new Expression("true or false")).evaluate();
            var val2 = await (new Expression("false or true")).evaluate();
            var val3 = await (new Expression("false or false")).evaluate();
            var val4 = await (new Expression("true or true")).evaluate();
            var val5 = await (new Expression("false or 10")).evaluate();
            var val6 = await (new Expression("null or 10")).evaluate();
            
            expect(val1).to.equal(true);
            expect(val2).to.equal(true);
            expect(val3).to.equal(false);
            expect(val4).to.equal(true);
            expect(val5).to.equal(10);
            expect(val6).to.equal(10);
        }
        runtest().then(done).catch(err => done(err));
    });    

    test("'and' operator", (done) => {
        async function runtest () {
            var val1 = await (new Expression("true and false")).evaluate();
            var val2 = await (new Expression("false and true")).evaluate();
            var val3 = await (new Expression("false and false")).evaluate();
            var val4 = await (new Expression("true and true")).evaluate();
            
            expect(val1).to.equal(false);
            expect(val2).to.equal(false);
            expect(val3).to.equal(false);
            expect(val4).to.equal(true);
        }
        runtest().then(done).catch(err => done(err));
    });    

    test("'not' operator", (done) => {
        async function runtest () {
            var val1 = await (new Expression("not false")).evaluate();
            var val2 = await (new Expression("not true")).evaluate();
            
            expect(val1).to.equal(true);
            expect(val2).to.equal(false);
        }
        runtest().then(done).catch(err => done(err));
    });    

    test("'if' operator", (done) => {
        async function runtest () {
            var val1 = await (new Expression("10 if true")).evaluate()
            var val2 = await (new Expression("10 if false")).evaluate()
            var val3 = await (new Expression("10 if true else 11")).evaluate()
            var val4 = await (new Expression("10 if false else 11")).evaluate()
                        
            expect(val1).to.equal(10);
            expect(val2).to.equal(undefined);
            expect(val3).to.equal(10);
            expect(val4).to.equal(11);
        }
        runtest().then(done).catch(err => done(err));
    });    

    test("property reference", (done) => {
        const context = {
            s: "abc",
            m: {x:10, y:20, z:30},
            a: [10,20,30]
        };
        async function runtest () {
            var val1 = await (new Expression("s")).evaluate(context);
            var val2 = await (new Expression("m.x")).evaluate(context);
            var val3 = await (new Expression("m['y']")).evaluate(context);
            var val4 = await (new Expression("a[1]")).evaluate(context);
            var val5 = await (new Expression("m.noname")).evaluate(context);
                        
            expect(val1).to.equal(context.s);
            expect(val2).to.equal(context.m.x);
            expect(val3).to.equal(context.m.y);
            expect(val4).to.equal(context.a[1]);
            expect(val5).to.equal(undefined);
        }
        runtest().then(done).catch(err => done(err));
    });  
    
    test("function call", (done) => {
        const context = {
            map: {
                syncfn: function (a,b) {
                    return {self:this, a:a, b:b}
                },                
                asyncfn: async function (a,b) {
                    return {self:this, a:a, b:b}
                },                
                callable: {
                    call: async function (self, a,b) {
                        return {self:self, a:a, b:b}
                    }
                },
                nofunc: 10
            },
            rootfn: function (a,b) {
                return {self:this, a:a, b:b}
            },                
        };        
        async function runtest () {
            var val1 = await (new Expression("map.syncfn(1,2)")).evaluate(context);
            var val2 = await (new Expression("map.asyncfn(3,4)")).evaluate(context);
            var val3 = await (new Expression("map.callable(5,6)")).evaluate(context);
            var val4 = await (new Expression("map.nofunc(7,8)")).evaluate(context);
            var val5 = await (new Expression("rootfn(9,10)")).evaluate(context);
                        
            expect(val1).to.deep.equal({self:context.map, a:1, b:2});
            expect(val2).to.deep.equal({self:context.map, a:3, b:4});
            expect(val3).to.deep.equal({self:context.map, a:5, b:6});
            expect(val4).to.be.undefined;
            expect(val5).to.deep.equal({self:context, a:9, b:10});
        }
        runtest().then(done).catch(err => done(err));
    });
    
    test("operators precedence", (done) => {
        const context = {
            P: {x:10, y:20, z:30}
        }
        async function runtest () {
            const expression = new Expression("0.5 + 2 * (10^2/2 - P.x)");
            var val1 = await expression.evaluate(context);            
            expect(val1).to.equal(0.5+2*(100/2-context.P.x));
        }
        runtest().then(done).catch(err => done(err));
    });
    
    test("sandbox", (done) => {
        const context = {
            fn: function () {},
            P: {x:10, y:20, z:30, _private:"secret"}
        }
        async function runtest () {
            var val1 = await (new Expression("P._private")).evaluate(context);            
            var val2 = await (new Expression("fn.constructor")).evaluate(context);            
            expect(val1).to.be.undefined;
            expect(val2).to.be.undefined;
        }
        runtest().then(done).catch(err => done(err));
    });     
    
    test("function definition", (done) => {
        async function runtest () {
            const expression = new Expression("(x, y) -> x+y");
            const fn = await expression.evaluate();
            expect(fn).to.be.a('function');
            const value = await fn(10, 2);
            expect(value).to.equal(12);
            
            const fn2 = await (new Expression("() -> this")).evaluate();
            const self = {};
            const val2 = await fn2.call(self);
            expect(val2).to.equal(self);
        }
        runtest().then(done).catch(done);
    });   

    test("special method __get__", (done) => {
        async function runtest () {
            const context = {
                obj: {
                    a: 10,
                    __get__: async (key) => key+"-value"
                }
            }
            
            var value = await (new Expression("obj.a")).evaluate(context);
            expect(value).to.equal(10);
            
            value = await (new Expression("obj.b")).evaluate(context);
            expect(value).to.equal("b-value");

            value = await (new Expression('obj["x"+"y"]')).evaluate(context);
            expect(value).to.equal("xy-value");
        }
        runtest().then(done).catch(done);
    });   
    
    test("error handling", (done) => {
        async function runtest () {
            const expression = new Expression('**Wrong syntax**');
            try {
                let value = await expression.evaluate();
                throw new Error("Didn't trhow");
            } catch (error) {
                expect(error).to.be.instanceof(parser.Error);
            }
        }
        runtest().then(done).catch(done);
    });   
});
