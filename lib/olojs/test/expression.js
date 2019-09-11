
var expect = require("chai").expect;

const ops = require("../lib/expression/operations");
const lexer = require("../lib/expression/lexer");
const parser = require("../lib/expression/parser");

async function expeval (source, scope) {
    const tokens = lexer.tokenize(source);
    const ast = parser.parse(tokens);
    return await ast.evaluate(scope);
}


describe("expeval(source, context)", () => {
    
    describe("A + B", () => {   
        it("should delegate to scope.$add", async () => {
            var scope = {$add: async (A,B) => `${A} (+) ${B}`};
            expect(await expeval("10+20", scope)).to.equal("10 (+) 20");
        });
    });
    
    describe("A - B", () => {
        it("should delegate to scope.$sub", async () => {
            var scope = {$sub: async (A,B) => `${A} (-) ${B}`};
            expect(await expeval("10-20", scope)).to.equal("10 (-) 20");
        });
    });
    
    describe("A * B", () => {
        it("should delegate to scope.$mul", async () => {
            var scope = {$mul: async (A,B) => `${A} (*) ${B}`};
            expect(await expeval("10*20", scope)).to.equal("10 (*) 20");
        });
    });
    
    describe("A / B", () => {
        it("should delegate to scope.$div", async () => {
            var scope = {$div: (A,B) => `${A} (/) ${B}`};
            expect(await expeval("10/20", scope)).to.equal("10 (/) 20");
        });
    });
    
    describe("A ^ B", () => {
        it("should delegate to scope.$pow", async () => {
            var scope = {$pow: (A,B) => `${A} (^) ${B}`};
            expect(await expeval("10^20", scope)).to.equal("10 (^) 20");
        });
    });
    
    describe("A == B", () => {
        it("should delegate to scope.$eq", async () => {
            var scope = {$eq: (A,B) => `${A} (==) ${B}`};
            expect(await expeval("10 == 20", scope)).to.equal("10 (==) 20");
        });
    });
    
    describe("A != B", () => {
        it("should delegate to scope.$ne", async () => {
            var scope = {$ne: (A,B) => `${A} (!=) ${B}`};
            expect(await expeval("10 != 20", scope)).to.equal("10 (!=) 20");
        });
    });
    
    describe("A < B", () => {
        it("should delegate to scope.$lt", async () => {
            var scope = {$lt: (A,B) => `${A} (<) ${B}`};
            expect(await expeval("10 < 20", scope)).to.equal("10 (<) 20");
        });
    });
    
    describe("A <= B", () => {
        it("should delegate to scope.$le", async () => {
            var scope = {$le: (A,B) => `${A} (<=) ${B}`};
            expect(await expeval("10 <= 20", scope)).to.equal("10 (<=) 20");
        });
    });
    
    describe("A > B", () => {
        it("should delegate to scope.$gt", async () => {
            var scope = {$gt: (A,B) => `${A} (>) ${B}`};
            expect(await expeval("10 > 20", scope)).to.equal("10 (>) 20");
        });
    });
    
    describe("A >= B", () => {
        it("should delegate to scope.$ge", async () => {
            var scope = {$ge: (A,B) => `${A} (>=) ${B}`};
            expect(await expeval("10 >= 20", scope)).to.equal("10 (>=) 20");
        });
    });
    
    describe("A or B", () => {
        it("should delegate to scope.$or", async () => {
            var scope = {$or: (A,B) => `${A} (|) ${B}`};
            expect(await expeval("10 or 20", scope)).to.equal("10 (|) 20");
        });
    });
    
    describe("A and B", () => {
        it("should delegate to scope.$and", async () => {
            var scope = {$and: (A,B) => `${A} (&) ${B}`};
            expect(await expeval("10 and 20", scope)).to.equal("10 (&) 20");
        });
    });

    describe("A if B", () => {
        it("should delegate to scope.$if", async () => {
            var scope = {$if: (A,B) => `${A} (?) ${B}`};
            expect(await expeval("10 if 20", scope)).to.equal("10 (?) 20");
        });
    });

    describe("A else B", () => {
        it("should delegate to scope.$else", async () => {
            var scope = {$else: (A,B) => `${A} (el) ${B}`};
            expect(await expeval("10 else 20", scope)).to.equal("10 (el) 20");
        });
    });
    
    describe("A.B", () => {
        
        it("should return the property B of the object A", async () => {
            var scope = {a:{b:1, c:{d:3}}};
            expect( await expeval("a.b", scope) ).to.equal(1);            
            expect( await expeval("a.c.d", scope) ).to.equal(3);            
        });        
        
        it("should return null if B is not contained in A", async () => {
            var scope = {a:{b:1}};
            expect( await expeval("a.c", scope) ).to.equal(null);            
        }); 

        it("should return null if B starts with '_'", async () => {
            var scope = {a:{_b:1}};
            expect( await expeval("a._b", scope) ).to.equal(null);            
        }); 
               
        it("should return null if A is not an object", async () => {
            var scope = {n:1, s:"abc", f:function () {}};
            expect( await expeval("n.toFixed", scope) ).to.equal(null);                        
            expect( await expeval("s.length", scope) ).to.equal(null);                        
            expect( await expeval("f.name", scope) ).to.equal(null);                        
        });        
    });
    
    describe("A[B]", () => {
        
        describe("when A is a string", () => {
            
            it("should return the character at index B, with 1-based indexing", async () => {
                var scope = {
                    s: "abcdef",
                };
                expect(await expeval("s[1]", scope)).to.equal("a");
                expect(await expeval("s[3]", scope)).to.equal("c");
                expect(await expeval("s[-1]", scope)).to.equal("f");
                expect(await expeval("s[-2]", scope)).to.equal("e");
            });
                        
            it("should return '' if B is not a valid index", async () => {
                var scope = {
                    s: "abcdef",
                    null: null
                };
                expect(await expeval("s[0]", scope)).to.equal("");
                expect(await expeval("s[-1000]", scope)).to.equal("");
                expect(await expeval("s[1000]", scope)).to.equal("");
                expect(await expeval("s[null]", scope)).to.equal("");
            });
        });
        
        describe("when A is an array", () => {
            
            it("should return the item at index B, with 1-based indexing", async () => {
                var scope = {
                    a: [10, 20, 30, 40, 50, 60],
                };
                expect(await expeval("a[1]", scope)).to.equal(10);
                expect(await expeval("a[3]", scope)).to.equal(30);
                expect(await expeval("a[-1]", scope)).to.equal(60);
                expect(await expeval("a[-2]", scope)).to.equal(50);
            });
                        
            it("should return null if B is not a valid index", async () => {
                var scope = {
                    a: [10, 20, 30, 40, 50, 60],
                    null: null
                };
                expect(await expeval("a[0]", scope)).to.equal(null);
                expect(await expeval("a[-1000]", scope)).to.equal(null);
                expect(await expeval("a[1000]", scope)).to.equal(null);
                expect(await expeval("a[null]", scope)).to.equal(null);
            });
        });
        
        describe("when A is an object", () => {
            
            it("should delegate to the Reference operation handler if B is a string", async () => {
                var scope = {
                    a: {
                        b: 1, 
                        c: {
                            d: 3
                        },
                        _e: 4,
                        f: function () {},
                    }
                };

                expect( await expeval("a['b']", scope) ).to.equal(1);            
                expect( await expeval("a['c']['d']", scope) ).to.equal(3);                        
                expect( await expeval("a['x']", scope) ).to.equal(null);                        
                expect( await expeval("a['_e']", scope) ).to.equal(null);                        
                expect( await expeval("a['f']['name']", scope) ).to.equal(null);                        
            });        

            it("should return the B-th key in alphabetical order if B is a number", async () => {
                var scope = {
                    o: {b1:10, b2:20, b3:30, b4:40, b5:50, b6:60, _b7:70}
                };

                expect( await expeval("o[2]", scope) ).to.equal('b2');            
                expect( await expeval("o[-1]", scope) ).to.equal('b6');                        
                expect( await expeval("o[1000]", scope) ).to.equal(null);                        
            });        
            
            it("should delegate to A.__get__ if it is a function", async () => {
                var scope = {
                    A: {__get__: async (B) => `GET ${B}`}
                };
                expect(await expeval("A[10]", scope)).to.equal("GET 10");                
            });
        });
        
        it("should return null if A is none of 'string', 'array', 'object'", async () => {
            var scope = {a:1};
            expect( await expeval("a['b']", scope) ).to.equal(null);                                    
        });        
    });

    describe("A(b1, b2, b3, ...)", () => {
        
        it("should call the function A passign the ginve arguments", async () => {
            var scope = {};
            scope.sum = function (a, b) { return a+b };
            scope.mul = (a, b) => a*b;
            scope.div = async function (a, b) { return a/b };
            expect( await expeval("sum(10,2)", scope)).to.equal(12);
            expect( await expeval("mul(10,2)", scope)).to.equal(20);
            expect( await expeval("div(10,2)", scope)).to.equal(5);
        });
        
        it("should delegate to A.__call__(args) if it exists", async () => {
            var scope = {};
            scope.sum = {
                __call__: (a,b) => a+b
            }
            expect( await expeval("sum(10,2)", scope)).to.equal(12);
        });        
        
        it("should return null if A is not callable", async () => {
            var scope = {};
            scope.f = 1;
            expect( await expeval("f(10,2)", scope)).to.equal(null);            
        });        
    });
    
    describe("name = expression", () => {
        
        it("should define a new name in the current namespace and assign it the result of the espression", async () => {
            var scope = {};
            await expeval("x = 10", scope);
            expect(scope.x).to.equal(10);
        });        
        
        it("should return null", async () => {
            var scope = {};
            var retval = await expeval("x = 10", scope);
            expect(retval).to.be.null;            
        });        
    });
    
    describe("name: (params) -> expression", () => {
        
        it("should define a new function in the current namespace", async () => {
            var scope = {
                $add: (x,y) => x+y
            };
            await expeval("foo: (a,b) -> a+b", scope);
            expect(scope.foo).to.be.a("function");
            expect(await scope.foo(1,2)).to.equal(3);
        }); 
        
        it("should return null", async () => {
            var scope = {};
            var retval = await expeval("foo: (a,b) -> a+b", scope);
            expect(retval).to.be.null;            
        });               
    });
    
    describe("[item1, item2, item3, ...]", () => {
        
        it("should return a new list", async () => {
            var scope = {
                x:2, 
                $mul: (x,y) => x*y
            };
            var expr = `[10, x*10, "abc"]`;
            expect( await expeval(expr, scope) ).to.deep.equal([10,20,"abc"]);
        });                        
    });
    
    describe("{name1=val1, name2=val2, ...}", () => {
        
        it("should define a new sub-namespace under the given name in the current namespace", async () => {
            var scope = {
                x:1, 
                k:2,
                $mul: (x,y) => x*y
            };
            var expr = `{
                x = 10,
                y = k*x,
                z = 30
            }`;
            expect( await expeval(expr, scope) ).to.deep.equal({x:10, y:20, z:30});
        });                        
    });
    
    describe("Binary operations precedence", () => {
        
        it("should execute the operations in order based on their precedence", async () => {
            var scope = {
                $add: (a,b) => a+b,
                $mul: (a,b) => a*b
            }
            expect( await expeval("10+20*30+40", scope) ).to.equal(650);
        });
        
        it("should execute the parenthesis first", async () => {
            var scope = {
                $add: (a,b) => a+b,
                $mul: (a,b) => a*b
            }
            expect( await expeval("10+20*(15+15)+40", scope) ).to.equal(650);            
        });
    });    
});
