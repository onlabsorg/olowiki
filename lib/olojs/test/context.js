
var expect = require("chai").expect;
var stripIndent = require("strip-indent");

var context = require("../lib/context");

var ops = require("../lib/expression/operations");
var NOTHING = context.NOTHING;
var TRUE = context.TRUE;
var FALSE = context.FALSE;
var ETC = context.ETC;
var LT = context.LT;
var EQ = context.EQ;
var GT = context.GT;


describe("context", () => {
    
    describe("context.size(X)", () => {
        
        it("should return the absolute value of X if it is a number", async () => {
            expect(await context.size(10)).to.equal(10);
            expect(await context.size(0)).to.equal(0);
            expect(await context.size(-10)).to.equal(10);
        });
        
        it("should return the number of characters of X if it is a string", async () => {
            expect(await context.size("abc")).to.equal(3);
            expect(await context.size("abcde")).to.equal(5);
            expect(await context.size("")).to.equal(0);            
        });
        
        it("should return the number of items of X if it is an array", async () => {
            expect(await context.size([10,20,30])).to.equal(3);
            expect(await context.size([10,20,30,40,50])).to.equal(5);
            expect(await context.size([])).to.equal(0);                        
        });
        
        it("should return the number of items of X if it is a namespace", async () => {
            expect(await context.size({x:10,y:20,z:30,_u:40, $v:50})).to.equal(3);
            expect(await context.size({})).to.equal(0);                                    
        });
        
        it("should delegate to X.__size__() if it exists", async () => {
            var X = {
                __size__: async () => 34.6
            }
            expect(await context.size(X)).to.equal(35);            

            var X = {
                __size__: async () => "abc"
            }
            expect(await context.size(X)).to.equal(0);            
        });
        
        it("should return 0 if X is NOTHING", async () => {
            expect(await context.size(NOTHING)).to.equal(0);            
        });
    });
    
    describe("context.bool(X)", () => {
        it("should return FALSE if the size of X is 0 or else TRUE", async () => {
            expect(await context.bool(NOTHING)).to.equal(FALSE);

            expect(await context.bool(0)).to.equal(FALSE);
            expect(await context.bool(1)).to.equal(TRUE);
            expect(await context.bool(10)).to.equal(TRUE);
            expect(await context.bool(-10)).to.equal(TRUE);

            expect(await context.bool("abc")).to.equal(TRUE);
            expect(await context.bool("")).to.equal(FALSE);

            expect(await context.bool([10,20,30])).to.equal(TRUE);
            expect(await context.bool([])).to.equal(FALSE);

            expect(await context.bool({x:10, y:20, z:30})).to.equal(TRUE);
            expect(await context.bool({})).to.equal(FALSE);
        });
    });    
    
    describe("context.str(X)", () => {
        
        it("should return '' if X is NOTHING", async () => {
            expect( await context.str(NOTHING) ).to.equal("");
        });

        it("should return String(X) if X is a number", async () => {
            expect( await context.str(-32.12) ).to.equal("-32.12");
        });

        it("should return X itself if X is a string", async () => {
            expect( await context.str("abc") ).to.equal("abc");
        });

        it("should return the concatenation of the stringified items if X is an arrya", async () => {
            var a = [NOTHING, "abc", 12, NOTHING, ["X", "Y", "Z"], NOTHING];
            expect( await context.str(a) ).to.equal("abc12XYZ");
        });

        it("should return the keys alphabetical list if X is an object", async () => {
            var o = {x:10, z:30, y:20, _w:40};
            expect( await context.str(o) ).to.equal("{x,y,z}");
        });

        it("should delegate ot X.__str__() if it existst", async () => {
            var X = {
                x:10, y:20, z:30, 
                description: "Test object X",
                __str__: async function () { return this.description }
            };
            expect( await context.str(X) ).to.equal(X
                
                .description);            
        });
    });
    
    describe("context.compare(L, R)", () => {
        
        describe("when L is NOTHING", () => {
            
            it("should return EQ if also R is NOTHING", async () => {
                expect(await context.compare(NOTHING, NOTHING)).to.equal(EQ);
            });
            
            it("should return LT if R anything but NOTHING", async () => {
                expect(await context.compare(NOTHING, 10)).to.equal(LT);
                expect(await context.compare(NOTHING, "abc")).to.equal(LT);
                expect(await context.compare(NOTHING, [10,20,30])).to.equal(LT);
                expect(await context.compare(NOTHING, {a:10,b:20,c:30})).to.equal(LT);
            });
        });
        
        describe("when L is a number", () => {
            
            it("should return GT if R is NOTHING", async () => {
                expect(await context.compare(10, NOTHING)).to.equal(GT);
            });
            
            it("should perform a numeric comparison if R is a number", async () => {
                expect(await context.compare(20, 30)).to.equal(LT);
                expect(await context.compare(20, 20)).to.equal(EQ);
                expect(await context.compare(20, 10)).to.equal(GT);
            });
            
            it("should return LT if R is a string", async () => {
                expect(await context.compare(10, "abc")).to.equal(LT);
            });  
                      
            it("should return LT if R is an array", async () => {
                expect(await context.compare(10, [10,20,30])).to.equal(LT);
            });            
            
            it("should return LT if R is an object", async () => {
                expect(await context.compare(10, {a:10,b:20,z:30})).to.equal(LT);                
            });   
        });
        
        describe("when L is a string", () => {
            
            it("should return GT if R is NOTHING", async () => {
                expect(await context.compare("abc", NOTHING)).to.equal(GT);
            });
            
            it("should return GT if R is a number", async () => {
                expect(await context.compare("abc", 10)).to.equal(GT);
            });            
            
            it("should compare L and R alphabetically if also R is a string", async () => {
                expect(await context.compare("abc", "abd")).to.equal(LT);
                expect(await context.compare("abc", "abcd")).to.equal(LT);

                expect(await context.compare("abc", "abc")).to.equal(EQ);
                
                expect(await context.compare("abd", "abc")).to.equal(GT);
                expect(await context.compare("abcd", "abc")).to.equal(GT);
            });            
            
            it("should return LT if R is an array", async () => {
                expect(await context.compare("abc", [10,20,30])).to.equal(LT);
            });            
            
            it("should return LT if R is an object", async () => {
                expect(await context.compare("abc", {a:10,b:20,c:30})).to.equal(LT);                
            });            
        });
        
        describe("when L is an array", () => {
            
            it("should return GT if R is NOTHING", async () => {
                expect(await context.compare([10,20,30], NOTHING)).to.equal(GT);
            });            
            
            it("should return GT if R is a number", async () => {
                expect(await context.compare([10,20,30], 100)).to.equal(GT);                
            });            
            
            it("should return GT if R is a string", async () => {
                expect(await context.compare([10,20,30], "abc")).to.equal(GT);                
            });            
            
            it("should compare item by item if also R is an array", async () => {
                expect(await context.compare([10,20,30], [10,20,40])).to.equal(LT);
                expect(await context.compare([10,20,30], [10,20,30,40])).to.equal(LT);

                expect(await context.compare([10,20,30], [10,20,30])).to.equal(EQ);
                
                expect(await context.compare([10,20,40], [10,20,30])).to.equal(GT);
                expect(await context.compare([10,20,30,40], [10,20,30])).to.equal(GT);                
            });            
            
            it("should return LT if R is an object", async () => {
                expect(await context.compare([10,20,30], {a:100})).to.equal(LT);                
            });            
        });
        
        describe("when L is an object", () => {
            
            it("should return GT if R is NOTHING", async () => {
                expect(await context.compare({a:10,b:20,c:30}, NOTHING)).to.equal(GT);
            });            
            
            it("should return GT if R is a number", async () => {
                expect(await context.compare({a:10,b:20,c:30}, 100)).to.equal(GT);
            });            
            
            it("should return GT if R is a string", async () => {
                expect(await context.compare({a:10,b:20,c:30}, "abc")).to.equal(GT);
            });            
            
            it("should return GT if R is an array", async () => {
                expect(await context.compare({a:10,b:20,c:30}, [10,20,30])).to.equal(GT);
            });            
            
            it("should compare item by item if also R is an object", async () => {
                expect(await context.compare({a:10,b:20,c:30}, {a:10,b:20,c:40})).to.equal(LT);
                expect(await context.compare({a:10,b:20,c:30}, {a:10,b:20,c:30,d:40})).to.equal(LT);

                expect(await context.compare({a:10,b:20,c:30}, {a:10,b:20,c:30})).to.equal(EQ);
                
                expect(await context.compare({a:10,b:20,c:40}, {a:10,b:20,c:30})).to.equal(GT);
                expect(await context.compare({a:10,b:20,c:30,d:40}, {a:10,b:20,c:30})).to.equal(GT);                                
            });
            
            it("should delegate to L.__vs__(R) if it exists and returns a number", async () => {
                var L = {a:10, b:20, c:30, __vs__: async (R) => -100}
                expect(await context.compare(L, {})).to.equal(LT);

                var L = {a:10, b:20, c:30, __vs__: async (R) => 0}
                expect(await context.compare(L, {})).to.equal(EQ);

                var L = {a:10, b:20, c:30, __vs__: async (R) => 100}
                expect(await context.compare(L, {a:100,b:200,c:300,d:400})).to.equal(GT);

                var L = {a:10, b:20, c:30, __vs__: async (R) => "abc"}
                expect(await context.compare(L, {a:100,b:200,c:300,d:400})).to.equal(LT);
                expect(await context.compare(L, {a:10,b:20,c:30})).to.equal(EQ);
                expect(await context.compare(L, {})).to.equal(GT);
            });
            
            it("should delegate to R.__vs__(L) if it exists  and returns a number and L.__vs__(R) doesn't exist or doesn't return a number", async () => {
                var R = {a:10, b:20, c:30, __vs__: async (L) => -100}
                expect(await context.compare({}, R)).to.equal(GT);

                var R = {a:10, b:20, c:30, __vs__: async (L) => 0}
                expect(await context.compare({}, R)).to.equal(EQ);

                var R = {a:10, b:20, c:30, __vs__: async (L) => 100}
                expect(await context.compare({a:100,b:200,c:300,d:400}, R)).to.equal(LT);

                var R = {a:10, b:20, c:30, __vs__: async (L) => "abc"}
                expect(await context.compare({}, R)).to.equal(LT);
                expect(await context.compare({a:10,b:20,c:30}, R)).to.equal(EQ);
                expect(await context.compare({a:100,b:200,c:300,d:400}, R)).to.equal(GT);
            });         
        });
    });
    
    describe("context.eval(expression)", () => {
        
        it("should evaluate the passed function with context as scope", async () => {
            var ctx = Object.create(context);
            
            expect(await ctx.eval("1+2")).to.equal(3);            
            
            ctx.x = 10;
            await ctx.eval("y = x * 2");
            expect(ctx.y).to.equal(20);
        });
        
        describe("L + R", () => {
            
            describe("when L is NOTHING", () => {
                it("should return R", async () => {
                    expect(await context.eval("NOTHING + NOTHING")).to.equal(NOTHING);
                    expect(await context.eval("NOTHING + 10")).to.equal(10);
                    expect(await context.eval("NOTHING + 'abc'")).to.equal("abc");
                    expect(await context.eval("NOTHING + [1,2,3]")).to.deep.equal([1,2,3]);
                    expect(await context.eval("NOTHING + {a=1,b=2,c=3}")).to.deep.equal({a:1,b:2,c:3});
                });
            });
            
            describe("when L is a number", () => {
                
                it("should return L if R is NOTHING", async () => {
                    expect(await context.eval("10 + NOTHING")).to.equal(10);                    
                });
                
                it("should return the sum of L and R if R is a number", async () => {
                    expect( await context.eval("10+1") ).to.equal(10+1);
                    expect( await context.eval("10+TRUE") ).to.equal(10+1);
                    expect( await context.eval("10+FALSE") ).to.equal(10+0);
                });
                
                it("should return NOTHING if R is a string", async () => {
                    expect(await context.eval("10 + 'abc'")).to.equal(NOTHING);                    
                });
                
                it("should return NOTHING if R is an array", async () => {
                    expect(await context.eval("10 + [1,2,3]")).to.equal(NOTHING);                    
                });
                
                it("should return NOTHING if R is an object", async () => {
                    expect(await context.eval("10 + {a=1,b=2,c=3}")).to.equal(NOTHING);                    
                });

                it("should delegate to R.__add__(L) if it exists", async () => {
                    var scope = Object.create(context);
                    scope.R = {
                       __add__: (L) => `R + ${L}`
                    };
                    expect( await scope.eval("10+R") ).to.equal(`R + 10`);                                    
                });                
            });
            
            describe("when L is a string", () => {
                
                it("should return L if R is NOTHING", async () => {
                    expect(await context.eval("'abc' + NOTHING")).to.equal('abc');                    
                });
                
                it("should return NOTHING if R is a number", async () => {
                    expect( await context.eval("'abc'+10") ).to.equal(NOTHING);
                });
                
                it("should return the concatenation of L and R, if R is a string", async () => {
                    expect(await context.eval("'abc' + 'def'")).to.equal("abcdef");                    
                });
                
                it("should return NOTHING if R is an array", async () => {
                    expect(await context.eval("'abc' + [1,2,3]")).to.equal(NOTHING);                    
                });
                
                it("should return NOTHING if R is an object", async () => {
                    expect(await context.eval("'abc' + {a=1,b=2,c=3}")).to.equal(NOTHING);                    
                });

                it("should delegate to R.__add__(L) if it exists", async () => {
                    var scope = Object.create(context);
                    scope.R = {
                       __add__: (L) => `R + ${L}`
                    };
                    expect( await scope.eval("'abc'+R") ).to.equal(`R + abc`);                
                });                
            });
            
            describe("when L is an array", () => {
                
                it("should return L if R is NOTHING", async () => {
                    expect(await context.eval("[1,2,3] + NOTHING")).to.deep.equal([1,2,3]);                    
                });
                
                it("should return NOTHING if R is a number", async () => {
                    expect( await context.eval("[1,2,3] + 10") ).to.equal(NOTHING);
                });
                
                it("should return NOTHING if R is a string", async () => {
                    expect(await context.eval("[1,2,3] + 'abc'")).to.equal(NOTHING);                    
                });
                
                it("should return NOTHING if R is an array", async () => {
                    expect(await context.eval("[1,2,3] + [4,5,6]")).to.deep.equal([1,2,3,4,5,6]);                    
                });
                
                it("should return NOTHING if R is an object", async () => {
                    expect(await context.eval("[1,2,3] + {a=1,b=2,c=3}")).to.equal(NOTHING);                    
                });
                
                it("should delegate to R.__add__(L) if it exists", async () => {
                    var scope = Object.create(context);
                    scope.R = {
                       __add__: (L) => `R + ${L.join("")}`
                    };
                    expect( await scope.eval("['A','B','C'] + R") ).to.equal(`R + ABC`);                                    
                });                
            });
            
            describe("when L is an object", () => {
                
                it("should return L if R is NOTHING", async () => {
                    expect(await context.eval("{a=1,b=2,c=3} + NOTHING")).to.deep.equal({a:1,b:2,c:3});                    
                });
                
                it("should return NOTHING if R is a number", async () => {
                    expect( await context.eval("{a=1,b=2,c=3} + 10") ).to.equal(NOTHING);
                });
                
                it("should return NOTHING if R is a string", async () => {
                    expect(await context.eval("{a=1,b=2,c=3} + 'abc'")).to.equal(NOTHING);                    
                });
                
                it("should return NOTHING if R is an array", async () => {
                    expect(await context.eval("{a=1,b=2,c=3} + [1,2,3]")).to.equal(NOTHING);                    
                });
                
                it("should return L merged with R, if R is an object", async () => {
                    var scope = Object.create(context);
                    scope.o1 = Object.create({a:1});
                    scope.o2 = Object.create({b:2});
                    scope.o1.x = 10;
                    scope.o1.y = 20;
                    scope.o2.y = 200;
                    scope.o2.z = 300;
                    expect( await scope.eval(`o1+o2`) ).to.deep.equal({x:10, y:200, z:300, a:1, b:2});
                });                

                it("should delegate to L.__add__(R) if it exists", async () => {
                    var scope = Object.create(context);
                    scope.o1 = {
                       __add__: (rho) => `o1 + ${rho}`
                    };
                    scope.o2 = {
                       toString: () => "o2"
                    }
                   
                    expect( await scope.eval("o1+3") ).to.equal("o1 + 3");            
                    expect( await scope.eval("o1+o2") ).to.equal(`o1 + o2`);
                });

                it("should delegate to R.__add__(L) if it exists and L.__add__ doesn't", async () => {
                    var scope = Object.create(context);
                    scope.R = {
                       __add__: (L) => `R + ${L}`
                    };
                    scope.L = {
                       toString: () => "L"
                    }
                    expect( await scope.eval("L+R") ).to.equal(`R + L`);                
                });
            });            
        });

        describe("L - R", () => {
            
            describe("when L is NOTHING", () => {
                it("should return NOTHING", async () => {
                    expect(await context.eval("NOTHING - NOTHING")).to.equal(NOTHING);
                    expect(await context.eval("NOTHING - 10")).to.equal(NOTHING);
                    expect(await context.eval("NOTHING - 'abc'")).to.equal(NOTHING);
                    expect(await context.eval("NOTHING - [1,2,3]")).to.equal(NOTHING);
                    expect(await context.eval("NOTHING - {a=1,b=2,c=3}")).to.equal(NOTHING);
                });
            });
            
            describe("when L is a number", () => {
                
                it("should return L if R is NOTHING", async () => {
                    expect(await context.eval("10 - NOTHING")).to.equal(10);                    
                });
                
                it("should return the difference between L and R if R is a number", async () => {
                    expect( await context.eval("10-1") ).to.equal(10-1);            
                });
                
                it("should return NOTHING if R is a string", async () => {
                    expect(await context.eval("10 - 'abc'")).to.equal(NOTHING);                    
                });
                
                it("should return NOTHING if R is an array", async () => {
                    expect(await context.eval("10 - [1,2,3]")).to.equal(NOTHING);                    
                });
                
                it("should return NOTHING if R is an object", async () => {
                    expect(await context.eval("10 - {a=1,b=2,c=3}")).to.equal(NOTHING);                    
                });
            });
            
            describe("when L is a string", () => {

                it("should return L if R is NOTHING", async () => {
                    expect(await context.eval("'abc' - NOTHING")).to.equal('abc');                    
                });
                
                it("should return NOTHING in all the other cases", async () => {
                    expect(await context.eval("'abc' - 10")).to.equal(NOTHING);
                    expect(await context.eval("'abc' - 'def'")).to.equal(NOTHING);
                    expect(await context.eval("'abc' - [1,2,3]")).to.equal(NOTHING);
                    expect(await context.eval("'abc' - {a=1,b=2,c=3}")).to.equal(NOTHING);                    
                });
            });
            
            describe("when L is an array", () => {
                
                it("should return L if R is NOTHING", async () => {
                    expect(await context.eval("[1,2,3] - NOTHING")).to.deep.equal([1,2,3]);                    
                });
                
                it("should return NOTHING in all the other cases", async () => {
                    expect(await context.eval("[1,2,3] - 10")).to.equal(NOTHING);
                    expect(await context.eval("[1,2,3] - 'def'")).to.equal(NOTHING);
                    expect(await context.eval("[1,2,3] - [4,5,6]")).to.equal(NOTHING);
                    expect(await context.eval("[1,2,3] - {a=1,b=2,c=3}")).to.equal(NOTHING);                    
                });
            });
            
            describe("when L is an object", () => {
                
                it("should return L if R is NOTHING", async () => {
                    expect(await context.eval("{a=1,b=2,c=3} - NOTHING")).to.deep.equal({a:1,b:2,c:3});                    
                });
                
                it("should delegate to L.__sub__(R) if it exists", async () => {
                    var scope = Object.create(context);
                    scope.o1 = {
                        __sub__: (R) => `o1 - ${R}`
                    };
                    scope.o2 = {
                        toString: () => "o2"
                    }
                    
                    expect( await scope.eval("o1-3") ).to.equal("o1 - 3");            
                    expect( await scope.eval("o1-o2") ).to.equal(`o1 - o2`);
                });
                
                it("should return NOTHING in all the other cases", async () => {
                    expect(await context.eval("{a=1,b=2,c=3} - 10")).to.equal(NOTHING);
                    expect(await context.eval("{a=1,b=2,c=3} - 'def'")).to.equal(NOTHING);
                    expect(await context.eval("{a=1,b=2,c=3} - [4,5,6]")).to.equal(NOTHING);
                    expect(await context.eval("{a=1,b=2,c=3} - {d=4,e=5}")).to.equal(NOTHING);                    
                });
            });            
        });
        
        describe("L * R", () => {
            
            describe("when L is NOTHING", () => {
                it("should return NOTHING", async () => {
                    expect( await context.eval("NOTHING*NOTHING") ).to.equal(NOTHING);                            
                    expect( await context.eval("NOTHING*10") ).to.equal(NOTHING);                            
                    expect( await context.eval("NOTHING*'abc'") ).to.equal(NOTHING);                            
                    expect( await context.eval("NOTHING*[1,2,3]") ).to.equal(NOTHING);                            
                    expect( await context.eval("NOTHING*{a=1,b=2,c=3}") ).to.equal(NOTHING);                            
                });                
            });
            
            describe("when L is a number", () => {
                
                it("should return NOTHING if R is NOTHING", async () => {
                    var scope = Object.create(context);
                    expect( await scope.eval("10*NOTHING") ).to.equal(NOTHING);                            
                });
                
                it("should return the product of L and R if R is a number", async () => {
                    var scope = Object.create(context);
                    expect( await scope.eval("10*2") ).to.equal(10*2);            
                });
                
                it("should return a string obtained concatenating L times R, if R is a string", async () => {
                    var scope = Object.create(context);
                    expect( await scope.eval("3*'Abc'") ).to.equal("AbcAbcAbc");            
                });

                it("should return an array obtained concatenating L times R, if R is an array", async () => {
                    var scope = Object.create(context);
                    expect( await scope.eval("3*[10,20,30]") ).to.deep.equal([10,20,30,10,20,30,10,20,30]);            
                });
                
                it("should return NOTHING if R is an object", async () => {
                    expect( await context.eval("10*{a=1,b=2,c=3}")).to.equal(NOTHING);
                    expect( await context.eval("0*{a=1,b=2,c=3}")).to.equal(NOTHING);
                });                

                it("should delegate to R.__mul__(L) if it exists", async () => {
                    var scope = Object.create(context);
                    scope.R = {
                       __mul__: (L) => `R * ${L}`
                    };
                    expect( await scope.eval("3*R") ).to.equal("R * 3");            
                });
            });
                        
            describe("when L is a string", () => {
                
                it("should return NOTHING if R is NOTHING", async () => {
                    expect( await context.eval("'abc' * NOTHING") ).to.equal(NOTHING);                            
                });                
                
                it("should return a string obtained concatenating R times L, if R is a number", async () => {
                    expect( await context.eval("'Abc'*3") ).to.equal("AbcAbcAbc");            
                });
                
                it("should return NOTHING if R is a string", async () => {
                    expect( await context.eval("'abc' * 'def'") ).to.equal(NOTHING);                            
                });                
                
                it("should return NOTHING if R is an array", async () => {
                    expect( await context.eval("'abc' * [1,2,3]") ).to.equal(NOTHING);                            
                });                
                
                it("should return NOTHING if R is an object", async () => {
                    expect( await context.eval("'abc' * {a=1,b=2,c=3}") ).to.equal(NOTHING);                            
                });                
                
                it("should delegate to R.__mul__(L) if it exists", async () => {
                    var scope = Object.create(context);
                    scope.R = {
                       __mul__: (L) => `R * ${L}`
                    };
                    expect( await scope.eval("'abc' * R") ).to.equal("R * abc");            
                });
            });
            
            describe("when L is an array", () => {
                
                it("should return NOTHING if R is NOTHING", async () => {
                    expect( await context.eval("[1,2,3] * NOTHING") ).to.equal(NOTHING);                            
                });                
                
                it("should return an array obtained concatenating R times L, if R is a number", async () => {
                    expect( await context.eval("[1,2,3] * 3") ).to.deep.equal([1,2,3,1,2,3,1,2,3]);            
                });
                
                it("should return NOTHING if R is a string", async () => {
                    expect( await context.eval("[1,2,3] * 'def'") ).to.equal(NOTHING);                            
                });                
                
                it("should return NOTHING if R is an array", async () => {
                    expect( await context.eval("[1,2,3] * [1,2,3]") ).to.equal(NOTHING);                            
                });                
                
                it("should return NOTHING if R is an object", async () => {
                    expect( await context.eval("[1,2,3] * {a=1,b=2,c=3}") ).to.equal(NOTHING);                            
                });                
                
                it("should delegate to R.__mul__(L) if it exists", async () => {
                    var scope = Object.create(context);
                    scope.R = {
                       __mul__: (L) => `R * ${L.join("")}`
                    };
                    expect( await scope.eval("['A','B','C'] * R") ).to.equal("R * ABC");            
                });
            });
                        
            describe("when L is an object", () => {
                
                it("should return NOTHING if R is NOTHING", async () => {
                    expect( await context.eval("{a=1,b=2,c=3} * NOTHING") ).to.equal(NOTHING);                            
                });                
                
                it("should return NOTHING if R is NOTHING", async () => {
                    expect( await context.eval("{a=1,b=2,c=3} * 10") ).to.equal(NOTHING);                            
                });                
                
                it("should return NOTHING if R is a string", async () => {
                    expect( await context.eval("{a=1,b=2,c=3} * 'def'") ).to.equal(NOTHING);                            
                });                
                
                it("should return NOTHING if R is an array", async () => {
                    expect( await context.eval("{a=1,b=2,c=3} * {d=4,e=5}") ).to.equal(NOTHING);                            
                });                
                
                it("should return NOTHING if R is an object", async () => {
                    expect( await context.eval("{a=1,b=2,c=3} * {a=1,b=2,c=3}") ).to.equal(NOTHING);                            
                });                

                it("should delegate to L.__mul__(R) if it exists", async () => {
                    var scope = Object.create(context);
                    scope.o1 = {
                        __mul__: (R) => `o1 (*) ${R}`
                    };
                    scope.o2 = {
                        toString: () => "o2"
                    }
                    expect( await scope.eval("o1*3") ).to.equal("o1 (*) 3");            
                    expect( await scope.eval("o1*o2") ).to.equal(`o1 (*) o2`);
                });
                
                it("should delegate to R.__mul__(L) if it exists and L.__mul__ doesn't", async () => {
                    var scope = Object.create(context);
                    scope.R = {
                       __mul__: (L) => `R * ${L}`
                   };
                    scope.L = {
                       toString: () => "L"
                   }
                   
                    expect( await scope.eval("3*R") ).to.equal("R * 3");            
                    expect( await scope.eval("L*R") ).to.equal(`R * L`);                
                });
            });
        });
        
        describe("L / R", () => {
            
            describe("when L is NOTHING", () => {
                it("should return NOTHING", async () => {
                    expect( await context.eval("NOTHING / NOTHING") ).to.equal(NOTHING);                            
                    expect( await context.eval("NOTHING / 10") ).to.equal(NOTHING);                            
                    expect( await context.eval("NOTHING / 'abc'") ).to.equal(NOTHING);                            
                    expect( await context.eval("NOTHING / [1,2,3]") ).to.equal(NOTHING);                            
                    expect( await context.eval("NOTHING / {a=1,b=2,c=3}") ).to.equal(NOTHING);                            
                });                
            });
            
            describe("when L is a number", () => {

                it("should return NOTHING if R is NOTHING", async () => {
                    expect( await context.eval("10 / NOTHING") ).to.equal(NOTHING);                            
                });
                
                it("should return L divided by R if R is a number", async () => {
                    expect( await context.eval("10/2") ).to.equal(10/2);            
                });
                
                it("should return NOTHING if R is a string", async () => {
                    expect( await context.eval("10 / 'abc'") ).to.equal(NOTHING);                            
                });
                
                it("should return NOTHING if R is an array", async () => {
                    expect( await context.eval("10 / [1,2,3]") ).to.equal(NOTHING);                            
                });
                
                it("should return NOTHING if R is an object", async () => {
                    expect( await context.eval("10 / {a=1,b=2,c=3}")).to.equal(NOTHING);
                });                
            });
            
            describe("when L is a string", () => {
                it("should return NOTHING", async () => {
                    expect( await context.eval("'abc' / NOTHING") ).to.equal(NOTHING);                            
                    expect( await context.eval("'abc' / 10") ).to.equal(NOTHING);                            
                    expect( await context.eval("'abc' / 'abc'") ).to.equal(NOTHING);                            
                    expect( await context.eval("'abc' / [1,2,3]") ).to.equal(NOTHING);                            
                    expect( await context.eval("'abc' / {a=1,b=2,c=3}") ).to.equal(NOTHING);                            
                });                                
            });
            
            describe("when L is an array", () => {
                it("should return NOTHING", async () => {
                    expect( await context.eval("[1,2,3] / NOTHING") ).to.equal(NOTHING);                            
                    expect( await context.eval("[1,2,3] / 10") ).to.equal(NOTHING);                            
                    expect( await context.eval("[1,2,3] / 'abc'") ).to.equal(NOTHING);                            
                    expect( await context.eval("[1,2,3] / [1,2,3]") ).to.equal(NOTHING);                            
                    expect( await context.eval("[1,2,3] / {a=1,b=2,c=3}") ).to.equal(NOTHING);                            
                });                                
            });
            
            describe("when L is an object", () => {

                it("should delegate to L.__div__(R) if it exists", async () => {
                    var scope = Object.create(context);
                    scope.o1 = {
                        __div__: (R) => `o1 (/) ${R}`
                    };
                    scope.o2 = {
                        toString: () => "o2"
                    }
                    expect( await scope.eval("o1/3") ).to.equal("o1 (/) 3");            
                    expect( await scope.eval("o1/o2") ).to.equal(`o1 (/) o2`);
                });
                
                it("should return NOTHING in all the other cases", async () => {
                    expect( await context.eval("{a=1,b=2,c=3} / NOTHING") ).to.equal(NOTHING);                            
                    expect( await context.eval("{a=1,b=2,c=3} / 10") ).to.equal(NOTHING);                            
                    expect( await context.eval("{a=1,b=2,c=3} / 'abc'") ).to.equal(NOTHING);                            
                    expect( await context.eval("{a=1,b=2,c=3} / [1,2,3]") ).to.equal(NOTHING);                            
                    expect( await context.eval("{a=1,b=2,c=3} / {a=1,b=2,c=3}") ).to.equal(NOTHING);                            
                });                                                
            });            
        });
        
        describe("L ^ R", () => {
            
            describe("when L is NOTHING", () => {
                it("should return NOTHING", async () => {
                    expect( await context.eval("NOTHING ^ NOTHING") ).to.equal(NOTHING);                            
                    expect( await context.eval("NOTHING ^ 10") ).to.equal(NOTHING);                            
                    expect( await context.eval("NOTHING ^ 'abc'") ).to.equal(NOTHING);                            
                    expect( await context.eval("NOTHING ^ [1,2,3]") ).to.equal(NOTHING);                            
                    expect( await context.eval("NOTHING ^ {a=1,b=2,c=3}") ).to.equal(NOTHING);                            
                });                
            });
            
            describe("when L is a number", () => {

                it("should return NOTHING if R is NOTHING", async () => {
                    expect( await context.eval("10 ^ NOTHING") ).to.equal(NOTHING);                            
                });
                
                it("should return L to the power of R if R is a number", async () => {
                    expect( await context.eval("10^2") ).to.equal(10**2);            
                });
                
                it("should return NOTHING if R is a string", async () => {
                    expect( await context.eval("10 ^ 'abc'") ).to.equal(NOTHING);                            
                });
                
                it("should return NOTHING if R is an array", async () => {
                    expect( await context.eval("10 ^ [1,2,3]") ).to.equal(NOTHING);                            
                });
                
                it("should return NOTHING if R is an object", async () => {
                    expect( await context.eval("10 ^ {a=1,b=2,c=3}")).to.equal(NOTHING);
                });                
            });
            
            describe("when L is a string", () => {
                it("should return NOTHING", async () => {
                    expect( await context.eval("'abc' ^ NOTHING") ).to.equal(NOTHING);                            
                    expect( await context.eval("'abc' ^ 10") ).to.equal(NOTHING);                            
                    expect( await context.eval("'abc' ^ 'abc'") ).to.equal(NOTHING);                            
                    expect( await context.eval("'abc' ^ [1,2,3]") ).to.equal(NOTHING);                            
                    expect( await context.eval("'abc' ^ {a=1,b=2,c=3}") ).to.equal(NOTHING);                            
                });                                
            });
            
            describe("when L is an array", () => {
                it("should return NOTHING", async () => {
                    expect( await context.eval("[1,2,3] ^ NOTHING") ).to.equal(NOTHING);                            
                    expect( await context.eval("[1,2,3] ^ 10") ).to.equal(NOTHING);                            
                    expect( await context.eval("[1,2,3] ^ 'abc'") ).to.equal(NOTHING);                            
                    expect( await context.eval("[1,2,3] ^ [1,2,3]") ).to.equal(NOTHING);                            
                    expect( await context.eval("[1,2,3] ^ {a=1,b=2,c=3}") ).to.equal(NOTHING);                            
                });                                
            });
            
            describe("when L is an object", () => {

                it("should delegate to L.__pow__(R) if it exists", async () => {
                    var scope = Object.create(context);
                    scope.o1 = {
                        __pow__: (R) => `o1 (^) ${R}`
                    };
                    scope.o2 = {
                        toString: () => "o2"
                    }
                    expect( await scope.eval("o1^3") ).to.equal("o1 (^) 3");            
                    expect( await scope.eval("o1^o2") ).to.equal(`o1 (^) o2`);
                });
                
                it("should return NOTHING in all the other cases", async () => {
                    expect( await context.eval("{a=1,b=2,c=3} ^ NOTHING") ).to.equal(NOTHING);                            
                    expect( await context.eval("{a=1,b=2,c=3} ^ 10") ).to.equal(NOTHING);                            
                    expect( await context.eval("{a=1,b=2,c=3} ^ 'abc'") ).to.equal(NOTHING);                            
                    expect( await context.eval("{a=1,b=2,c=3} ^ [1,2,3]") ).to.equal(NOTHING);                            
                    expect( await context.eval("{a=1,b=2,c=3} ^ {a=1,b=2,c=3}") ).to.equal(NOTHING);                            
                });                                                
            });            
        });
        
        describe("L == R", () => {
            it("should return TRUE if `compare(L,R)` returns `EQ`, or else FALSE", async () => {
                var scope = Object.create(context);

                scope.compare = async (L, R) => LT;
                expect( await scope.eval("1==1") ).to.equal(FALSE);                                    
                expect( await scope.eval("'abc'=='abc'") ).to.equal(FALSE);                                    

                scope.compare = async (L, R) => EQ;
                expect( await scope.eval("1==1") ).to.equal(TRUE);                                    
                expect( await scope.eval("'abc'=='abc'") ).to.equal(TRUE);                                    

                scope.compare = async (L, R) => GT;
                expect( await scope.eval("1==1") ).to.equal(FALSE);                                    
                expect( await scope.eval("'abc'=='abc'") ).to.equal(FALSE);                                    
            });            
        });
        
        describe("L != R", () => {
            it("should return TRUE if `compare(L,R)` returns `LT` or 'GT', otherwise FALSE", async () => {
                var scope = Object.create(context);

                scope.compare = async (L, R) => LT;
                expect( await scope.eval("1!=1") ).to.equal(TRUE);                                    
                expect( await scope.eval("'abc'!='abc'") ).to.equal(TRUE);                                    

                scope.compare = async (L, R) => EQ;
                expect( await scope.eval("1!=1") ).to.equal(FALSE);                                    
                expect( await scope.eval("'abc'!='abc'") ).to.equal(FALSE);                                    

                scope.compare = async (L, R) => GT;
                expect( await scope.eval("1!=1") ).to.equal(TRUE);                                    
                expect( await scope.eval("'abc'!='abc'") ).to.equal(TRUE);                                    
            });            
        });
        
        describe("L < R", () => {
            it("should return TRUE if `compare(L,R)` returns `LT`, or else FALSE", async () => {
                var scope = Object.create(context);

                scope.compare = async (L, R) => LT;
                expect( await scope.eval("1<1") ).to.equal(TRUE);                                    
                expect( await scope.eval("'abc'<'abc'") ).to.equal(TRUE);                                    

                scope.compare = async (L, R) => EQ;
                expect( await scope.eval("1<1") ).to.equal(FALSE);                                    
                expect( await scope.eval("'abc'<'abc'") ).to.equal(FALSE);                                    

                scope.compare = async (L, R) => GT;
                expect( await scope.eval("1<1") ).to.equal(FALSE);                                    
                expect( await scope.eval("'abc'<'abc'") ).to.equal(FALSE);                                    
            });            
        });
        
        describe("L > R", () => {            
            it("should return TRUE if `compare(L,R)` returns `GT`, or else FALSE", async () => {
                var scope = Object.create(context);

                scope.compare = async (L, R) => LT;
                expect( await scope.eval("1>1") ).to.equal(FALSE);                                    
                expect( await scope.eval("'abc'>'abc'") ).to.equal(FALSE);                                    

                scope.compare = async (L, R) => EQ;
                expect( await scope.eval("1>1") ).to.equal(FALSE);                                    
                expect( await scope.eval("'abc'>'abc'") ).to.equal(FALSE);                                    

                scope.compare = async (L, R) => GT;
                expect( await scope.eval("1>1") ).to.equal(TRUE);                                    
                expect( await scope.eval("'abc'>'abc'") ).to.equal(TRUE);                                    
            });            
        });
        
        describe("L <= R", () => {
            it("should return TRUE if `compare(L,R)` returns `LT` or `EQ`, otherwise FALSE", async () => {
                var scope = Object.create(context);

                scope.compare = async (L, R) => LT;
                expect( await scope.eval("1<=1") ).to.equal(TRUE);                                    
                expect( await scope.eval("'abc'<='abc'") ).to.equal(TRUE);                                    

                scope.compare = async (L, R) => EQ;
                expect( await scope.eval("1<=1") ).to.equal(TRUE);                                    
                expect( await scope.eval("'abc'<='abc'") ).to.equal(TRUE);                                    

                scope.compare = async (L, R) => GT;
                expect( await scope.eval("1<=1") ).to.equal(FALSE);                                    
                expect( await scope.eval("'abc'<='abc'") ).to.equal(FALSE);                                    
            });            
        });
        
        describe("A >= B", () => {
            it("should return TRUE if `compare(L,R)` returns `GT` or `EQ`, otherwise FALSE", async () => {
                var scope = Object.create(context);

                scope.compare = async (L, R) => LT;
                expect( await scope.eval("1>=1") ).to.equal(FALSE);                                    
                expect( await scope.eval("'abc'>='abc'") ).to.equal(FALSE);                                    

                scope.compare = async (L, R) => EQ;
                expect( await scope.eval("1>=1") ).to.equal(TRUE);                                    
                expect( await scope.eval("'abc'>='abc'") ).to.equal(TRUE);                                    

                scope.compare = async (L, R) => GT;
                expect( await scope.eval("1>=1") ).to.equal(TRUE);                                    
                expect( await scope.eval("'abc'>='abc'") ).to.equal(TRUE);
            });            
        });        

        describe("L or R", () => {
            it("should return TRUE if either bool(L) or bool(R) is TRUE, or else FALSE", async () => {
                var scope = Object.create(context);
                
                expect( await scope.eval("FALSE or FALSE") ).to.equal(FALSE);                        
                expect( await scope.eval("TRUE or TRUE") ).to.equal(TRUE);            
                expect( await scope.eval("TRUE or FALSE") ).to.equal(TRUE);            
                expect( await scope.eval("FALSE or TRUE") ).to.equal(TRUE);            

                expect( await scope.eval("10 or 20") ).to.equal(TRUE);            
                expect( await scope.eval("10 or 0") ).to.equal(TRUE);            
                expect( await scope.eval("0 or 20") ).to.equal(TRUE);            
                expect( await scope.eval("0 or 0") ).to.equal(FALSE);                        
                
                expect( await scope.eval("NOTHING or FALSE") ).to.equal(FALSE);                        
            });    
        });
        
        describe("L and R", () => {
            
            it("should return TRUE if both bool(L) and bool(R) are TRUE, or else FALSE", async () => {
                var scope = Object.create(context);
                
                expect( await scope.eval("FALSE and FALSE") ).to.equal(FALSE);                        
                expect( await scope.eval("TRUE and TRUE") ).to.equal(TRUE);            
                expect( await scope.eval("TRUE and FALSE") ).to.equal(FALSE);            
                expect( await scope.eval("FALSE and TRUE") ).to.equal(FALSE);            

                expect( await scope.eval("10 and 20") ).to.equal(TRUE);            
                expect( await scope.eval("10 and 0") ).to.equal(FALSE);            
                expect( await scope.eval("0 and 20") ).to.equal(FALSE);            
                expect( await scope.eval("0 and 0") ).to.equal(FALSE);                        
                
                expect( await scope.eval("NOTHING and 10") ).to.equal(FALSE);                                    
            });
        });        

        describe("L if R", () => {
            it("should return L if bool(R) is TRUE, or else NOTHING", async () => {
                var scope = Object.create(context);
                expect( await scope.eval("10 if TRUE") ).to.equal(10);
                expect( await scope.eval("10 if 100") ).to.equal(10);
                expect( await scope.eval("10 if 'abc'") ).to.equal(10);

                expect( await scope.eval("10 if FALSE") ).to.equal(NOTHING);            
                expect( await scope.eval("10 if 0") ).to.equal(NOTHING);            
                expect( await scope.eval("10 if ''") ).to.equal(NOTHING);            
            });
        });        

        describe("L else R", () => {
            it("should return L if not NOTHING, otherwise R", async () => {
                var scope = Object.create(context);
                expect( await scope.eval("10 else 20") ).to.equal(10);
                expect( await scope.eval("NOTHING else 20") ).to.equal(20);                        
                expect( await scope.eval("FALSE else 20") ).to.equal(FALSE);                        
            });        
        });        

        describe("A if B else C", () => {
            it("should return A if bool(B) is TRUE, otherwise C", async () => {
                var scope = Object.create(context);
                expect( await scope.eval("10 if TRUE else 20") ).to.equal(10);
                expect( await scope.eval("10 if 111 else 20") ).to.equal(10);
                expect( await scope.eval("10 if 'abc' else 20") ).to.equal(10);
                
                expect( await scope.eval("10 if FALSE else 20") ).to.equal(20);                                    
                expect( await scope.eval("10 if NOTHING else 20") ).to.equal(20);                                    
                expect( await scope.eval("10 if '' else 20") ).to.equal(20);                                    
            });        
        });        
    });

    describe("context.not(X)", () => {
        it("should return TRUE if bool(X) is FALSE, otherwise FALSE", async () => {
            expect(await context.not(true)).to.equal(FALSE);
            expect(await context.not(TRUE)).to.equal(FALSE);
            expect(await context.not(10)).to.equal(FALSE);
            expect(await context.not("abc")).to.equal(FALSE);
            expect(await context.not([10,20,30])).to.equal(FALSE);
            
            expect(await context.not(NOTHING)).to.equal(TRUE);
            expect(await context.not(false)).to.equal(TRUE);
            expect(await context.not(FALSE)).to.equal(TRUE);
            expect(await context.not(0)).to.equal(TRUE);
            expect(await context.not("")).to.equal(TRUE);
            expect(await context.not([])).to.equal(TRUE);
            expect(await context.not({})).to.equal(TRUE);
        });
    });

    describe("context.list(X)", () => {
        
        it("should return [] if R is NOTHING", () => {
            expect(context.list(NOTHING)).to.deep.equal([]);
        });
        
        it("should return [] if R is a number", () => {
            expect(context.list(10)).to.deep.equal([]);
        });
        
        it("should return the list of characters if R is a string", () => {
            expect(context.list("abc")).to.deep.equal(['a','b','c']);
        });
        
        it("should return R itself if it is a list", () => {
            expect(context.list([10,20,30])).to.deep.equal([10,20,30]);
        });
        
        it("should return the keys in alphabetic order if R is an object", () => {
            expect(context.list({b:2, a:1, _d:4, c:3})).to.deep.equal(['a','b','c']);            
        });
    });
    
    describe("context.find(X, item)", () => {
        
        it("should return an array with all the the positions of item in X if both X and item are string, or [] if not found", async () => {
            expect(await context.find("12aa567aa", "aa")).to.deep.equal([3,8]);
            expect(await context.find("abcdefghi", "DEF")).to.deep.equal([]);
            expect(await context.find("abcdefghi", ['b','c'])).to.deep.equal([]);
        });
        
        it("should return an array with all the positions of item in X if X is an array, or [] if not found", async () => {
            var X = [10,99,30,40,99,60];
            expect(await context.find(X, 99)).to.deep.equal([2,5]);
            expect(await context.find(X, 70)).to.deep.equal([]);
        });
        
        it("should return an array with all the keys of item in X if X is an object, or [] if not found", async () => {
            var X = {a:10, _b:99, c:30, b:99, d:99};
            expect(await context.find(X, 99)).to.deep.equal(['b','d']);
            expect(await context.find(X, 100)).to.deep.equal([]);
        });
        
        it("should return NOTHING in all the other cases", async () => {
            expect(await context.find(10, 1)).to.equal(NOTHING);
            expect(await context.find(NOTHING, 1)).to.equal(NOTHING);
        });
    });
    
    describe("context.this", () => {
        it("should return the current namespace", async () => {
            var scope = Object.create(context);
            
            expect(context.this).to.equal(context);
            expect(scope.this).to.equal(scope);
            
            expect(await context.eval("this")).to.equal(context);
            expect(await scope.eval("this")).to.equal(scope);
            
            let ns = await scope.eval("{self = this}");
            expect(ns.self.self).to.equal(ns.self);
        });
    });

    describe("context.parent(X)", () => {
        it("should return the prototpye of X if X is an object, otherwise NOTHING", async () => {
            var p = {};
            var X = Object.create(p);
            expect(context.parent(X)).to.equal(p);
            expect(context.parent(NOTHING)).to.equal(NOTHING);
            expect(context.parent(10)).to.equal(NOTHING);
            expect(context.parent("abc")).to.equal(NOTHING);
            expect(context.parent([10,20,30])).to.equal(NOTHING);
            
            expect(await context.eval("{p = parent(this)}")).to.deep.equal({p:context});            
        });
    });    
});
