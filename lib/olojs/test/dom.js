var expect = require("chai").expect;
var stripIndent = require("strip-indent");

var Expression = require("../lib/expression");
var dom = require("../lib/dom");

var Context = require("../lib/context");
var context = new Context();

var errors = require("../lib/errors");


describe("DOM", () => {
    
    describe("Node", () => {
        
        describe("Node.prototype.name - getter", () => {
            it("should return the node name", () => {
                var node = new dom.Node("name", "value");
                expect(node.name).to.equal("name")
            });
        });

        describe("Node.prototype.name - setter", () => {
            it("should set the node name", () => {
                var node = new dom.Node("name", "value");
                node.name = "name1";
                expect(node.name).to.equal("name1")
            });
            it("should throw an error if the new name is not valid", () => {
                var node = new dom.Node("name", "value");
                try {
                    node.name = "non valid name";
                    throw new Error("It didn't throw!")
                } catch (error) {
                    expect(error.message).to.equal("Invalid node name!");
                }
            });
        });
        
        describe("Node.prototype.value - getter", () => {
            it("should return the node value", () => {
                var node = new dom.Node("name", "value");
                expect(node.value).to.equal("value")
            });
        });

        describe("Node.prototype.value - setter", () => {
            it("should set the node value", () => {
                var node = new dom.Node("name", "value");
                node.value = "value1";
                expect(node.value).to.equal("value1")
            });
            it("should excape new-line characters", () => {
                var node = new dom.Node("name", "value");
                node.value = "value1 \n value2";
                expect(node.value).to.equal("value1 \\n value2");
            });
        });    
        
        describe("Node.prototype.appendChild(node)", () => {
            
            it("should add a child node as last", () => {
                var node = new dom.Node("name", "value");
                var child1 = new dom.Node("name1", "value1");
                var child2 = new dom.Node("name2", "value2");
                var child3 = new dom.Node("name3", "value3");
                expect(node.cardinality).to.equal(0)
                expect(child1.cardinality).to.equal(0)
                expect(child2.cardinality).to.equal(0)
                expect(child3.cardinality).to.equal(0)

                node.appendChild(child1);
                expect(node.cardinality).to.equal(1)
                expect(node.getChild(0)).to.equal(child1);

                node.appendChild(child2);
                expect(node.cardinality).to.equal(2)
                expect(node.getChild(0)).to.equal(child1);
                expect(node.getChild(1)).to.equal(child2);

                node.appendChild(child3);
                expect(node.cardinality).to.equal(3)
                expect(node.getChild(0)).to.equal(child1);
                expect(node.getChild(1)).to.equal(child2);
                expect(node.getChild(2)).to.equal(child3);
            });
            
            it("should throw a TypeError if trying to add other than a Node", () => {
                var node = new dom.Node("name", "value");
                try {
                    node.appendChild({});
                    throw new Error("It didn't throw!");
                } catch (error) {
                    expect(error).to.be.instanceof(errors.TypeError);
                }
            });
        });    
        
        describe("Node.prototype.getChild(key)", () => {
            
            it("should return the node at the given index if key is a number", () => {
                var node = new dom.Node("name", "value");
                var child1 = new dom.Node("name1", "value1");
                var child2 = new dom.Node("name2", "value2");
                var child3 = new dom.Node("name3", "value3");

                node.appendChild(child1);
                node.appendChild(child2);
                node.appendChild(child3);

                expect(node.getChild(0)).to.equal(child1);
                expect(node.getChild(1)).to.equal(child2);
                expect(node.getChild(2)).to.equal(child3);                
            });
            
            it("should return the node at the given index from the end if key is negative", () => {
                var node = new dom.Node("name", "value");
                var child1 = new dom.Node("name1", "value1");
                var child2 = new dom.Node("name2", "value2");
                var child3 = new dom.Node("name3", "value3");

                node.appendChild(child1);
                node.appendChild(child2);
                node.appendChild(child3);

                expect(node.getChild(-3)).to.equal(child1);
                expect(node.getChild(-2)).to.equal(child2);
                expect(node.getChild(-1)).to.equal(child3);                                
            });
            
            it("should return null if key is an out of range number", () => {
                var node = new dom.Node("name", "value");
                var child1 = new dom.Node("name1", "value1");
                var child2 = new dom.Node("name2", "value2");
                var child3 = new dom.Node("name3", "value3");

                node.appendChild(child1);
                node.appendChild(child2);
                node.appendChild(child3);

                expect(node.getChild(3)).to.be.null;
                expect(node.getChild(-4)).to.be.null;
            });
            
            it("should return the last node with the given name if key is a string", () => {
                var node = new dom.Node("name", "value");
                var child1 = new dom.Node("name1", "value1");
                var child2 = new dom.Node("name2", "value2");
                var child3 = new dom.Node("name2", "value3");

                node.appendChild(child1);
                node.appendChild(child2);
                node.appendChild(child3);

                expect(node.getChild("name1")).to.equal(child1);
                expect(node.getChild("name2")).to.equal(child3);
            });
            
            it("should return null if key is a string not matching any child name", () => {
                var node = new dom.Node("name", "value");
                var child1 = new dom.Node("name1", "value1");
                var child2 = new dom.Node("name2", "value2");
                var child3 = new dom.Node("name3", "value3");

                node.appendChild(child1);
                node.appendChild(child2);
                node.appendChild(child3);

                expect(node.getChild("name4")).to.be.null;
            });
        });
        
        describe("Node.prototype.cardinality - getter", () => {
            
            it("should return the number of children of a node", () => {
                var node = new dom.Node("name", "value");
                var child1 = new dom.Node("name1", "value1");
                var child2 = new dom.Node("name2", "value2");
                var child3 = new dom.Node("name3", "value3");

                expect(node.cardinality).to.equal(0);
                expect(child1.cardinality).to.equal(0);
                expect(child2.cardinality).to.equal(0);
                expect(child3.cardinality).to.equal(0);
                
                node.appendChild(child1);
                expect(node.cardinality).to.equal(1);
                expect(child1.cardinality).to.equal(0);
                expect(child2.cardinality).to.equal(0);
                expect(child3.cardinality).to.equal(0);
                
                node.appendChild(child2);
                expect(node.cardinality).to.equal(2);
                expect(child1.cardinality).to.equal(0);
                expect(child2.cardinality).to.equal(0);
                expect(child3.cardinality).to.equal(0);
                
                node.appendChild(child3);
                expect(node.cardinality).to.equal(3);
                expect(child1.cardinality).to.equal(0);
                expect(child2.cardinality).to.equal(0);
                expect(child3.cardinality).to.equal(0);                
            });
        });
        
        describe("Node.prototype.parent - getter", () => {
            
            it("should return the parent node", () => {
                var node = new dom.Node("name", "value");
                var child1 = new dom.Node("name1", "value1");
                var child2 = new dom.Node("name2", "value2");
                var child3 = new dom.Node("name3", "value3");

                node.appendChild(child1);
                child1.appendChild(child2);
                child2.appendChild(child3);

                expect(child1.parent).to.equal(node);                
                expect(child2.parent).to.equal(child1);                
                expect(child3.parent).to.equal(child2);                
            });
            
            it("should return null if the node is orphan", () => {
                var node = new dom.Node("name", "value");
                expect(node.parent).to.be.null;                
            });
        });
        
        describe("Node.prototype.index - getter", () => {
            
            it("should return the position of the node in its parent child list", () => {
                var node = new dom.Node("name", "value");
                var child1 = new dom.Node("name1", "value1");
                var child2 = new dom.Node("name2", "value2");
                var child3 = new dom.Node("name3", "value3");

                node.appendChild(child1);
                node.appendChild(child2);
                node.appendChild(child3);

                expect(child1.index).to.equal(0);
                expect(child2.index).to.equal(1);
                expect(child3.index).to.equal(2);
            });
            
            it("should return 0 if the node is orphan", () => {
                var node = new dom.Node("name", "value");
                expect(node.index).to.equal(0);                                
            });
        });
        
        describe("Node.prototype.stringifyRootLine()", () => {
            it("should render name and value, separated by a colon", () => {
                var node = new dom.Node("name","value");
                expect(node.stringifyRootLine()).to.equal("name: value");
                
                var node = new dom.Node("name","");
                expect(node.stringifyRootLine()).to.equal("name: ");
            });
            
            it("should omit the colon if name is not defined", () => {
                var node = new dom.Node("","value");
                expect(node.stringifyRootLine()).to.equal("value");                
            });
            
            it("should add extra spaces as specified in the node options", () => {
                var node = new dom.Node("name", "value", {
                    spacesBeforeColon: 2,
                    spacesAfterColon: 3,
                    trailingSpaces: 4                    
                });
                expect(node.stringifyRootLine()).to.equal("name  :   value    ");                
            })
        });

        describe("Node.prototype.stringifyChildList()", () => {
            
            it("should return the child node's text source", () => {
                var node = new dom.Node("name", "value");
                var child1 = new dom.Node("name1", "value1");
                var child2 = new dom.Node("name2", "value2");
                var child3 = new dom.Node("name3", "value3");

                node.appendChild(child1);
                node.appendChild(child2);
                node.appendChild(child3);
                
                var childSource = node.stringifyChildList();
                expect(childSource).to.equal("name1: value1\nname2: value2\nname3: value3");
            });        
        });

        describe.skip("Node.prototype.stringify()", () => {
            it("...", () => {});        
        });

        describe.skip("Node.prototype.evaluate(context)", () => {
            it("...", () => {});        
        });
        
        describe("Node.parse(source)", () => {
            
            it("should return a Node instance from its literal representation", () => {
                
                // +name +value -children
                var node = dom.Node.parse("name: value");
                expect(node).to.be.instanceof(dom.Node); 
                expect(node.name).to.equal("name");
                expect(node.value).to.equal("value");
                expect(node.cardinality).to.equal(0);
                expect(node.parent).to.be.null;
                expect(node.index).to.equal(0);
                
                
                // -name +value -children
                var node = dom.Node.parse("value");
                expect(node).to.be.instanceof(dom.Node); 
                expect(node.name).to.equal("");
                expect(node.value).to.equal("value");                
                expect(node.cardinality).to.equal(0);
                expect(node.parent).to.be.null;
                expect(node.index).to.equal(0);
                
                
                // +name -value -children
                var node = dom.Node.parse("name:");
                expect(node).to.be.instanceof(dom.Node); 
                expect(node.name).to.equal("name");
                expect(node.value).to.equal("");                
                expect(node.cardinality).to.equal(0);
                expect(node.parent).to.be.null;
                expect(node.index).to.equal(0);
                
                
                // +name +value +children -grandchildren (no empty lines)
                var node = dom.Node.parse("name: value\n" +
                                          "   child1: value1\n" +
                                          "   child2: value2\n" +
                                          "   child3: value3\n" );
                expect(node).to.be.instanceof(dom.Node); 
                expect(node.name).to.equal("name");
                expect(node.value).to.equal("value");
                expect(node.cardinality).to.equal(3);
                expect(node.parent).to.be.null;
                expect(node.index).to.equal(0);
                
                var child1 = node.getChild(0);
                expect(child1).to.be.instanceof(dom.Node);
                expect(child1.name).to.equal("child1");
                expect(child1.value).to.equal("value1");
                expect(child1.cardinality).to.equal(0);
                expect(child1.parent).to.equal(node);
                expect(child1.index).to.equal(0);
                
                var child2 = node.getChild(1);
                expect(child2).to.be.instanceof(dom.Node);
                expect(child2.name).to.equal("child2");
                expect(child2.value).to.equal("value2");
                expect(child2.cardinality).to.equal(0);
                expect(child2.parent).to.equal(node);
                expect(child2.index).to.equal(1);
                
                var child3 = node.getChild(2);
                expect(child3).to.be.instanceof(dom.Node);
                expect(child3.name).to.equal("child3");
                expect(child3.value).to.equal("value3");
                expect(child3.cardinality).to.equal(0);
                expect(child3.parent).to.equal(node);
                expect(child3.index).to.equal(2);
                
                
                // +name +value +children +grandchildren (no empty lines)
                var node = dom.Node.parse("name: value\n" +
                                          "   child1: value1\n" +
                                          "       child2: value2\n" +
                                          "   child3: value3\n" );
                expect(node).to.be.instanceof(dom.Node); 
                expect(node.name).to.equal("name");
                expect(node.value).to.equal("value");
                expect(node.cardinality).to.equal(2);
                expect(node.parent).to.be.null;
                expect(node.index).to.equal(0);
                
                var child1 = node.getChild(0);
                expect(child1).to.be.instanceof(dom.Node);
                expect(child1.name).to.equal("child1");
                expect(child1.value).to.equal("value1");
                expect(child1.cardinality).to.equal(1);
                expect(child1.parent).to.equal(node);
                expect(child1.index).to.equal(0);
                
                var child2 = child1.getChild(0);
                expect(child2).to.be.instanceof(dom.Node);
                expect(child2.name).to.equal("child2");
                expect(child2.value).to.equal("value2");
                expect(child2.cardinality).to.equal(0);
                expect(child2.parent).to.equal(child1);
                expect(child2.index).to.equal(0);
                
                var child3 = node.getChild(1);
                expect(child3).to.be.instanceof(dom.Node);
                expect(child3.name).to.equal("child3");
                expect(child3.value).to.equal("value3");
                expect(child3.cardinality).to.equal(0);
                expect(child3.parent).to.equal(node);
                expect(child3.index).to.equal(1);


                // +name +value +children +grandchildren (with empty lines)
                var node = dom.Node.parse("name: value\n" +
                                          "   \n" +
                                          "   child1: value1\n" +
                                          "\n" +
                                          "       child2: value2\n" +
                                          "           \n" +
                                          " \n" +
                                          "   child3: value3" );
                expect(node).to.be.instanceof(dom.Node); 
                expect(node.name).to.equal("name");
                expect(node.value).to.equal("value");
                expect(node.cardinality).to.equal(2);
                expect(node.parent).to.be.null;
                expect(node.index).to.equal(0);

                var child1 = node.getChild(0);
                expect(child1).to.be.instanceof(dom.Node);
                expect(child1.name).to.equal("child1");
                expect(child1.value).to.equal("value1");
                expect(child1.cardinality).to.equal(1);
                expect(child1.parent).to.equal(node);
                expect(child1.index).to.equal(0);

                var child2 = child1.getChild(0);
                expect(child2).to.be.instanceof(dom.Node);
                expect(child2.name).to.equal("child2");
                expect(child2.value).to.equal("value2");
                expect(child2.cardinality).to.equal(0);
                expect(child2.parent).to.equal(child1);
                expect(child2.index).to.equal(0);

                var child3 = node.getChild(1);
                expect(child3).to.be.instanceof(dom.Node);
                expect(child3.name).to.equal("child3");
                expect(child3.value).to.equal("value3");
                expect(child3.cardinality).to.equal(0);
                expect(child3.parent).to.equal(node);
                expect(child3.index).to.equal(1);
            });

            it("should throw a parse error in case of wrong indentation", () => {
                try {
                    var node = dom.Node.parse("name: value\n" +
                                              "   child1: value1\n" +
                                              "   child2: value2\n" +
                                              " child3: value3\n" );
                    throw new Error("Id didn't throw!");
                } catch (error) {
                    expect(error).to.be.instanceof(errors.SyntaxError);
                }
            });
        });
    });
    
    describe.skip("NodeProxy", () => {
        it("...", () => {});        
    });
    
    describe.skip("Document", () => {
        it("...", () => {});        
    });
});
