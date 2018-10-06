// Run test:
// mocha -u tdd test/olojs/oloxp

const oloxp = require("../../lib/olojs/oloxp");
const expect = require("chai").expect;


suite("oloxp", () => {
    
    test("oloxp.Context", () => {
        const globals = {g:9.81};
        const self = {};
        const args = [10,20,30];
        const context = oloxp.Context(globals, self, ...args);
        expect(Object.getPrototypeOf(context)).to.equal(globals);
        expect(context.$0).to.equal(self);
        expect(context.$1).to.equal(10);
        expect(context.$2).to.equal(20);
        expect(context.$3).to.equal(30);
        expect(context.$count).to.equal(3);        
    });
    
    suite("oloxp.evaluate", () => {
        
        test("+ operator", (done) => {
            async function runtest () {
                const val = await oloxp.evaluate("10+1");
                expect(val).to.equal(11);            
            }
            runtest().then(done).catch(err => done(err));
        });    

        test("- operator", (done) => {
            async function runtest () {
                const val = await oloxp.evaluate("10-1");
                expect(val).to.equal(9);            
            }
            runtest().then(done).catch(err => done(err));
        });    

        test("* operator", (done) => {
            async function runtest () {
                const val = await oloxp.evaluate("10*2");
                expect(val).to.equal(20);            
            }
            runtest().then(done).catch(err => done(err));
        });    

        test("/ operator", (done) => {
            async function runtest () {
                const val = await oloxp.evaluate("10/2");
                expect(val).to.equal(5);            
            }
            runtest().then(done).catch(err => done(err));
        });    

        test("'mod' operator", (done) => {
            async function runtest () {
                const val = await oloxp.evaluate("10 mod 4");
                expect(val).to.equal(2);            
            }
            runtest().then(done).catch(err => done(err));
        });    
        
        test("^ operator", (done) => {
            async function runtest () {
                const val = await oloxp.evaluate("10^2");
                expect(val).to.equal(100);            
            }
            runtest().then(done).catch(err => done(err));
        });    
            
        test("== operator", (done) => {
            async function runtest () {
                var val = await oloxp.evaluate("10 == 2");
                expect(val).to.equal(false);

                val = await oloxp.evaluate("10 == 10");
                expect(val).to.equal(true);
            }
            runtest().then(done).catch(err => done(err));
        });    
        
        test("!= operator", (done) => {
            async function runtest () {
                var val = await oloxp.evaluate("10 != 2");
                expect(val).to.equal(true);

                val = await oloxp.evaluate("10 != 10");
                expect(val).to.equal(false);
            }
            runtest().then(done).catch(err => done(err));
        });    

        test("> operator", (done) => {
            async function runtest () {
                var val1 = await oloxp.evaluate("10 > 2");
                var val2 = await oloxp.evaluate("2 > 10");
                var val3 = await oloxp.evaluate("10 > 10");
                
                expect(val1).to.equal(true);
                expect(val2).to.equal(false);
                expect(val3).to.equal(false);
            }
            runtest().then(done).catch(err => done(err));
        });    

        test("< operator", (done) => {
            async function runtest () {
                var val1 = await oloxp.evaluate("10 < 2");
                var val2 = await oloxp.evaluate("2 < 10");
                var val3 = await oloxp.evaluate("10 < 10");
                
                expect(val1).to.equal(false);
                expect(val2).to.equal(true);
                expect(val3).to.equal(false);
            }
            runtest().then(done).catch(err => done(err));
        });    
        
        test(">= operator", (done) => {
            async function runtest () {
                var val1 = await oloxp.evaluate("10 >= 2");
                var val2 = await oloxp.evaluate("2 >= 10");
                var val3 = await oloxp.evaluate("10 >= 10");
                
                expect(val1).to.equal(true);
                expect(val2).to.equal(false);
                expect(val3).to.equal(true);
            }
            runtest().then(done).catch(err => done(err));
        });    

        test("<= operator", (done) => {
            async function runtest () {
                var val1 = await oloxp.evaluate("10 <= 2");
                var val2 = await oloxp.evaluate("2 <= 10");
                var val3 = await oloxp.evaluate("10 <= 10");
                
                expect(val1).to.equal(false);
                expect(val2).to.equal(true);
                expect(val3).to.equal(true);
            }
            runtest().then(done).catch(err => done(err));
        });    

        test("'or' operator", (done) => {
            async function runtest () {
                var val1 = await oloxp.evaluate("true or false");
                var val2 = await oloxp.evaluate("false or true");
                var val3 = await oloxp.evaluate("false or false");
                var val4 = await oloxp.evaluate("true or true");
                var val5 = await oloxp.evaluate("false or 10");
                var val6 = await oloxp.evaluate("null or 10");
                
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
                var val1 = await oloxp.evaluate("true and false");
                var val2 = await oloxp.evaluate("false and true");
                var val3 = await oloxp.evaluate("false and false");
                var val4 = await oloxp.evaluate("true and true");
                
                expect(val1).to.equal(false);
                expect(val2).to.equal(false);
                expect(val3).to.equal(false);
                expect(val4).to.equal(true);
            }
            runtest().then(done).catch(err => done(err));
        });    

        test("'not' operator", (done) => {
            async function runtest () {
                var val1 = await oloxp.evaluate("not false");
                var val2 = await oloxp.evaluate("not true");
                
                expect(val1).to.equal(true);
                expect(val2).to.equal(false);
            }
            runtest().then(done).catch(err => done(err));
        });    

        test("'if' operator", (done) => {
            async function runtest () {
                var val1 = await oloxp.evaluate("10 if true");
                var val2 = await oloxp.evaluate("10 if false");
                var val3 = await oloxp.evaluate("10 if true or 11");
                var val4 = await oloxp.evaluate("10 if false or 11");
                            
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
                var val1 = await oloxp.evaluate("s", context);
                var val2 = await oloxp.evaluate("m.x", context);
                var val3 = await oloxp.evaluate("m['y']", context);
                var val4 = await oloxp.evaluate("a[1]", context);
                var val5 = await oloxp.evaluate("m.noname", context);
                            
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
                        return {scope:this, a:a, b:b}
                    },                
                    asyncfn: async function (a,b) {
                        return {scope:this, a:a, b:b}
                    },                
                    callable: {
                        evaluate: async function (self, a,b) {
                            return {scope:self, a:a, b:b}
                        }
                    },
                    nofunc: 10
                }
            };        
            async function runtest () {
                var val1 = await oloxp.evaluate("map.syncfn(1,2)", context);
                var val2 = await oloxp.evaluate("map.asyncfn(3,4)", context);
                var val3 = await oloxp.evaluate("map.callable(5,6)", context);
                var val4 = await oloxp.evaluate("map.nofunc(7,8)", context);
                            
                expect(val1).to.deep.equal({scope:context.map, a:1, b:2});
                expect(val2).to.deep.equal({scope:context.map, a:3, b:4});
                expect(val3).to.deep.equal({scope:context.map, a:5, b:6});
                expect(val4).to.be.undefined;
            }
            runtest().then(done).catch(err => done(err));
        });
        
        test("'this' keyword", (done) => {
            const context = {
                $0: {}
            }
            async function runtest () {
                var val1 = await oloxp.evaluate("this", context);
                expect(val1).to.equal(context.$0);
            }
            runtest().then(done).catch(err => done(err));
        });
        
        test("operators precedence", (done) => {
            const context = {
                P: {x:10, y:20, z:30}
            }
            async function runtest () {
                var val1 = await oloxp.evaluate("0.5 + 2 * (10^2/2 - P.x)", context);            
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
                var val1 = await oloxp.evaluate("P._private", context);            
                var val2 = await oloxp.evaluate("fn.constructor", context);            
                expect(val1).to.be.undefined;
                expect(val2).to.be.undefined;
            }
            runtest().then(done).catch(err => done(err));
        });        
    });    
});