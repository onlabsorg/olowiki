var expect = require("chai").expect;
var stripIndent = require("strip-indent");

var Expression = require("../lib/expression");
var dom = require("../lib/dom");

var Context = require("../lib/context");

var errors = require("../lib/errors");


describe("DOM", () => {
    
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
    
    describe("Node.prototype.cardinality - getter", () => {
        
        it("should return the number of children of a node", () => {
            var node = new dom.Node("name", "value");
            expect(node.cardinality).to.equal(0)
            
            var child1 = new dom.Node("name1", "value1");
            var child2 = new dom.Node("name2", "value2");
            var child3 = new dom.Node("name3", "value3");
            var node = new dom.Node("name", "value", [child1, child2, child3]);
            expect(node.cardinality).to.equal(3)
        });
    });
    
    describe("Node.prototype.getChild(n)", () => {
        
        it("should return the child node matching the node identifier `n`", () => {
            var child1 = new dom.Node("name1", "value1");
            var child2 = new dom.Node("name2", "value2");
            var child3 = new dom.Node("name3", "value3");
            var node = new dom.Node("name", "value", [child1, child2, child3]);

            expect(node.getChild(1)).to.equal(child1);
            expect(node.getChild(2)).to.equal(child2);
            expect(node.getChild(3)).to.equal(child3);                
            
            expect(node.getChild(-3)).to.equal(child1);
            expect(node.getChild(-2)).to.equal(child2);
            expect(node.getChild(-1)).to.equal(child3);                

            expect(node.getChild('name1')).to.equal(child1);
            expect(node.getChild('name2')).to.equal(child2);
            expect(node.getChild('name3')).to.equal(child3);                

            expect(node.getChild(child1)).to.equal(child1);
            expect(node.getChild(child2)).to.equal(child2);
            expect(node.getChild(child3)).to.equal(child3);                
            
            child2.name = "name3";
            expect(node.getChild('name3')).to.equal(child2);                            
        });
        
        it("should return null if no index matches n", () => {
            var child1 = new dom.Node("name1", "value1");
            var child2 = new dom.Node("name2", "value2");
            var child3 = new dom.Node("name3", "value3");
            var node = new dom.Node("name", "value", [child1, child2, child3]);

            expect(node.getChild(0)).to.be.null;
            expect(node.getChild(4)).to.be.null;
            expect(node.getChild(-4)).to.be.null;
            expect(node.getChild('name4')).to.be.null;
            
            var child4 = new dom.Node("name4", "value4");
            expect(node.getChild(child4)).to.be.null;                
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
            expect(node.getChild(1)).to.equal(child1);

            node.appendChild(child2);
            expect(node.cardinality).to.equal(2)
            expect(node.getChild(1)).to.equal(child1);
            expect(node.getChild(2)).to.equal(child2);

            node.appendChild(child3);
            expect(node.cardinality).to.equal(3)
            expect(node.getChild(1)).to.equal(child1);
            expect(node.getChild(2)).to.equal(child2);
            expect(node.getChild(3)).to.equal(child3);
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
        
        it("should throw an error if the node has already a parent", () => {
            var node1 = new dom.Node("name1", "value1");
            var node2 = new dom.Node("name2", "value2", [node1]);
            var node3 = new dom.Node("name3", "value3");
            try {
                node3.appendChild(node1);
                throw new Error("It didn't throw!");
            } catch (error) {
                expect(error).to.be.instanceof(errors.ValueError);
            }                
        });
    });    
    
    describe("Node.prototype.parent - getter", () => {
        
        it("should return the parent node", () => {
            var child1 = new dom.Node("name1", "value1");                
            var child2 = new dom.Node("name2", "value2");
            var child3 = new dom.Node("name3", "value3");
            var node = new dom.Node("name", "value", [child1]);

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

            expect(child1.index).to.equal(1);
            expect(child2.index).to.equal(2);
            expect(child3.index).to.equal(3);
        });
        
        it("should return 0 if the node is orphan", () => {
            var node = new dom.Node("name", "value");
            expect(node.index).to.equal(0);                                
        });
    });

    describe("Node.prototype.insertChild(node, n)", () => {
        
        it("should insert the given node at the before the child returned by .getChild(n)", () => {
            var child1 = new dom.Node("name1", "value1");
            var child9 = new dom.Node("name9", "value9");
            var node = new dom.Node("name", "value", [child1, child9]);
        
            var child2 = new dom.Node("name2", "value2");
            node.insertChild(child2, 2);
            expect(child2.parent).to.equal(node);                
            expect(node.cardinality).to.equal(3);
            expect(node.getChild(1)).to.equal(child1);
            expect(node.getChild(2)).to.equal(child2);
            expect(node.getChild(3)).to.equal(child9);
            
            var child3 = new dom.Node("name3", "value3");
            node.insertChild(child3, -1);
            expect(child3.parent).to.equal(node);                
            expect(node.cardinality).to.equal(4);
            expect(node.getChild(1)).to.equal(child1);
            expect(node.getChild(2)).to.equal(child2);
            expect(node.getChild(3)).to.equal(child3);
            expect(node.getChild(4)).to.equal(child9);

            var child4 = new dom.Node("name4", "value4");
            node.insertChild(child4, 'name9');
            expect(child3.parent).to.equal(node);                
            expect(node.cardinality).to.equal(5);
            expect(node.getChild(1)).to.equal(child1);
            expect(node.getChild(2)).to.equal(child2);
            expect(node.getChild(3)).to.equal(child3);
            expect(node.getChild(4)).to.equal(child4);
            expect(node.getChild(5)).to.equal(child9);

            var child5 = new dom.Node("name5", "value5");
            node.insertChild(child5, child9);
            expect(child3.parent).to.equal(node);                
            expect(node.cardinality).to.equal(6);
            expect(node.getChild(1)).to.equal(child1);
            expect(node.getChild(2)).to.equal(child2);
            expect(node.getChild(3)).to.equal(child3);
            expect(node.getChild(4)).to.equal(child4);
            expect(node.getChild(5)).to.equal(child5);
            expect(node.getChild(6)).to.equal(child9);
        });
        
        it("should have no effect if the there is no index corresponding to n", () => {
            var child1 = new dom.Node("name1", "value1");
            var child2 = new dom.Node("name2", "value2");
            var node = new dom.Node("name", "value", [child1, child2]);
        
            var child3 = new dom.Node("name3", "value3");
            node.insertChild(child3, 100);
            expect(child3.parent).to.be.null;
            expect(node.cardinality).to.equal(2);
            expect(node.getChild(1)).to.equal(child1);
            expect(node.getChild(2)).to.equal(child2);
        });
        
        it("should throw a TypeError if trying to insert other than a Node", () => {
            var child1 = new dom.Node("name1", "value1");
            var child2 = new dom.Node("name2", "value2");
            var node = new dom.Node("name", "value", [child1, child2]);
            try {
                node.insertChild({}, 2);
                throw new Error("It didn't throw!");
            } catch (error) {
                expect(error).to.be.instanceof(errors.TypeError);
            }
        });
        
        it("should throw an error if the node has already a parent", () => {
            var node1 = new dom.Node("name1", "value1");
            var node2 = new dom.Node("name2", "value2", [node1]);
            var node3 = new dom.Node("name3", "value3");
            try {
                node3.insertChild(node1, 1);
                throw new Error("It didn't throw!");
            } catch (error) {
                expect(error).to.be.instanceof(errors.ValueError);
            }                                
        });
    });
    
    describe("Node.prototype.removeChild(n)", () => {
        
        it("should remove and return the child node returned by .getChild(n)", () => {
            var child1 = new dom.Node("name1", "value1");
            var child2 = new dom.Node("name2", "value2");
            var child3 = new dom.Node("name3", "value3");
            var child4 = new dom.Node("name4", "value4");
            var child5 = new dom.Node("name5", "value5");
            var child6 = new dom.Node("name6", "value6");
            var node = new dom.Node("name", "value", [child1, child2, child3, child4, child5, child6]);
        
            var removedNode = node.removeChild(2);
            expect(removedNode).to.equal(child2);   
            expect(removedNode.parent).to.be.null;             
            expect(node.cardinality).to.equal(5);
            expect(node.getChild(1)).to.equal(child1);
            expect(node.getChild(2)).to.equal(child3);
            expect(node.getChild(3)).to.equal(child4);
            expect(node.getChild(4)).to.equal(child5);
            expect(node.getChild(5)).to.equal(child6);

            var removedNode = node.removeChild(-1);
            expect(removedNode).to.equal(child6);   
            expect(removedNode.parent).to.be.null;             
            expect(node.cardinality).to.equal(4);
            expect(node.getChild(1)).to.equal(child1);
            expect(node.getChild(2)).to.equal(child3);
            expect(node.getChild(3)).to.equal(child4);
            expect(node.getChild(4)).to.equal(child5);

            var removedNode = node.removeChild('name4');
            expect(removedNode).to.equal(child4);   
            expect(removedNode.parent).to.be.null;             
            expect(node.cardinality).to.equal(3);
            expect(node.getChild(1)).to.equal(child1);
            expect(node.getChild(2)).to.equal(child3);
            expect(node.getChild(3)).to.equal(child5);

            var removedNode = node.removeChild(child1);
            expect(removedNode).to.equal(child1);   
            expect(removedNode.parent).to.be.null;             
            expect(node.cardinality).to.equal(2);
            expect(node.getChild(1)).to.equal(child3);
            expect(node.getChild(2)).to.equal(child5);
        });
        
        it("should fail and return 'null' if n doesn't match any child", () => {
            var child1 = new dom.Node("name1", "value1");
            var child2 = new dom.Node("name2", "value2");
            var child3 = new dom.Node("name3", "value3");
            var node = new dom.Node("name", "value", [child1, child2, child3]);
        
            var removedNode = node.removeChild(0);
            expect(removedNode).to.be.null;
            expect(node.cardinality).to.equal(3);
            expect(node.getChild(1)).to.equal(child1);
            expect(node.getChild(2)).to.equal(child2);
            expect(node.getChild(3)).to.equal(child3);
            
            var removedNode = node.removeChild(100);
            expect(removedNode).to.be.null;
            expect(node.cardinality).to.equal(3);
            expect(node.getChild(1)).to.equal(child1);
            expect(node.getChild(2)).to.equal(child2);
            expect(node.getChild(3)).to.equal(child3);
            
            var removedNode = node.removeChild(-100);
            expect(removedNode).to.be.null;
            expect(node.cardinality).to.equal(3);
            expect(node.getChild(1)).to.equal(child1);
            expect(node.getChild(2)).to.equal(child2);
            expect(node.getChild(3)).to.equal(child3);

            var removedNode = node.removeChild('name4');
            expect(removedNode).to.be.null;
            expect(node.cardinality).to.equal(3);
            expect(node.getChild(1)).to.equal(child1);
            expect(node.getChild(2)).to.equal(child2);
            expect(node.getChild(3)).to.equal(child3);

            var child4 = new dom.Node("name4", "value4");
            var removedNode = node.removeChild(child4);
            expect(removedNode).to.be.null;
            expect(node.cardinality).to.equal(3);
            expect(node.getChild(1)).to.equal(child1);
            expect(node.getChild(2)).to.equal(child2);
            expect(node.getChild(3)).to.equal(child3);
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
            var node = new dom.Node("name", "value", [], {
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

        it("should add leading empty lines as specified in the options", () => {
            var node = new dom.Node("name", "value", [
                new dom.Node("name1", "value1"),
                new dom.Node("name2", "value2"),
                new dom.Node("name3", "value3")
            ], {
                emptyLinesAfter: [2, 3]
            });
            
            var childSource = node.stringifyChildList();
            expect(childSource).to.equal("  \n   \nname1: value1\nname2: value2\nname3: value3");
            
        });
    });

    describe("Node.prototype.stringify()", () => {
        
        it("should return the node text source", () => {
            var child1 = new dom.Node("name1", "value1");
            var child2 = new dom.Node("name2", "value2");
            var child3 = new dom.Node("name3", "value3");
            var node = new dom.Node("name", "value", [child1, child2, child3]);
            expect(node.stringify()).to.equal("name: value\n    name1: value1\n    name2: value2\n    name3: value3");
        });        
        
        it("should add leading empty lines as specified in the options", () => {
            var node = new dom.Node("name", "value", [
                new dom.Node("name1", "value1"),
                new dom.Node("name2", "value2"),
                new dom.Node("name3", "value3")
            ], {
                emptyLinesAfter: [2, 3]
            });                
            expect(node.stringify()).to.equal("name: value\n      \n       \n    name1: value1\n    name2: value2\n    name3: value3");
        });
            
        it("should set the indentation as specified in the options", () => {
            var node = new dom.Node("name", "value", [
                new dom.Node("name1", "value1"),
                new dom.Node("name2", "value2"),
                new dom.Node("name3", "value3")
            ], {
                childListIndent: 2
            });
            expect(node.stringify()).to.equal("name: value\n  name1: value1\n  name2: value2\n  name3: value3");                
        });
    });

    describe("Node.prototype.toString()", () => {
        
        it("should return the node text source", () => {
            var child1 = new dom.Node("name1", "value1");
            var child2 = new dom.Node("name2", "value2");
            var child3 = new dom.Node("name3", "value3");
            var node = new dom.Node("name", "value", [child1, child2, child3]);
            expect(node.stringify()).to.equal("name: value\n    name1: value1\n    name2: value2\n    name3: value3");
        });        
        
        it("should add leading empty lines as specified in the options", () => {
            var node = new dom.Node("name", "value", [
                new dom.Node("name1", "value1"),
                new dom.Node("name2", "value2"),
                new dom.Node("name3", "value3")
            ], {
                emptyLinesAfter: [2, 3]
            });                
            expect(node.stringify()).to.equal("name: value\n      \n       \n    name1: value1\n    name2: value2\n    name3: value3");
        });
            
        it("should set the indentation as specified in the options", () => {
            var node = new dom.Node("name", "value", [
                new dom.Node("name1", "value1"),
                new dom.Node("name2", "value2"),
                new dom.Node("name3", "value3")
            ], {
                childListIndent: 2
            });
            expect(node.stringify()).to.equal("name: value\n  name1: value1\n  name2: value2\n  name3: value3");                
        });
    });
    
    describe("Node.prototype.parseChildList(source)", () => {
        
        it("should update node descentants with the outlined outlined in the source text", () => {
            var child1 = new dom.Node("initalChild1", "");
            var child2 = new dom.Node("initalChild2", "");
            var child3 = new dom.Node("initalChild3", "");
            var node = new dom.Node("node", "value", [child1, child2, child3]);
            
            var source = "   \n" +
                            "child1: value1  \n" +
                            "      \n" +
                            "    child11: value11  \n" +
                            "    child12: value12  \n" +
                            "child2: value2\n" +
                            "child3: value3\n" +
                            "      ";
                            
            node.parseChildList(source);
            
            expect(node).to.be.instanceof(dom.Node); 
            expect(node.name).to.equal("node");
            expect(node.value).to.equal("value");
            expect(node.cardinality).to.equal(3);
            expect(node.parent).to.be.null;
            expect(node.index).to.equal(0);
            
            var child1 = node.getChild(1);
            expect(child1).to.be.instanceof(dom.Node);
            expect(child1.name).to.equal("child1");
            expect(child1.value).to.equal("value1");
            expect(child1.cardinality).to.equal(2);
            expect(child1.parent).to.equal(node);
            expect(child1.index).to.equal(1);
            
            var child2 = node.getChild(2);
            expect(child2).to.be.instanceof(dom.Node);
            expect(child2.name).to.equal("child2");
            expect(child2.value).to.equal("value2");
            expect(child2.cardinality).to.equal(0);
            expect(child2.parent).to.equal(node);
            expect(child2.index).to.equal(2);
            
            var child3 = node.getChild(3);
            expect(child3).to.be.instanceof(dom.Node);
            expect(child3.name).to.equal("child3");
            expect(child3.value).to.equal("value3");
            expect(child3.cardinality).to.equal(0);
            expect(child3.parent).to.equal(node);
            expect(child3.index).to.equal(3);      
            
            expect(node.stringifyChildList()).to.equal(source);          
        });        
        
        it("should throw an errors.SyntaxError if the source is not a valid outline of node representations", () => {
            var node = new dom.Node("name", "value", []);
            
            var source = "   \n" +
                            "child1: value1  \n" +
                            "      \n" +
                            "    child11: value11  \n" +
                            "    child12: value12  \n" +
                            "  child2: value2\n" +
                            "child3: value3\n" +
                            "  ";

            try {
                node.parseChildList(source);
                throw new Error("It did not throw!");
            } catch (error) {
                expect(error).to.be.instanceof(errors.SyntaxError);
            }
        });
    });
    
    describe("parse(source)", () => {
        
        it("should return a Node instance with name 'root' and value ''", () => {
            var root = dom.parse(stripIndent(`
                name1: value1
                name2: value2
                name3: value3
                `));
            expect(root).to.be.instanceof(dom.Node);
            expect(root.name).to.equal("root");
            expect(root.value).to.equal("");
        });
        
        it("should return a Node instance containing the descendants outlined in the source text", () => {
            
            var source = stripIndent(`
                child1: value1
                child2: value2
                child3: value3`);
                        
            var root = dom.parse(source);
            
            expect(root).to.be.instanceof(dom.Node); 
            expect(root.name).to.equal("root");
            expect(root.value).to.equal("");
            expect(root.cardinality).to.equal(3);
            expect(root.parent).to.be.null;
            expect(root.index).to.equal(0);
            
            var child1 = root.getChild(1);
            expect(child1).to.be.instanceof(dom.Node);
            expect(child1.name).to.equal("child1");
            expect(child1.value).to.equal("value1");
            expect(child1.cardinality).to.equal(0);
            expect(child1.parent).to.equal(root);
            expect(child1.index).to.equal(1);
            
            var child2 = root.getChild(2);
            expect(child2).to.be.instanceof(dom.Node);
            expect(child2.name).to.equal("child2");
            expect(child2.value).to.equal("value2");
            expect(child2.cardinality).to.equal(0);
            expect(child2.parent).to.equal(root);
            expect(child2.index).to.equal(2);
            
            var child3 = root.getChild(3);
            expect(child3).to.be.instanceof(dom.Node);
            expect(child3.name).to.equal("child3");
            expect(child3.value).to.equal("value3");
            expect(child3.cardinality).to.equal(0);
            expect(child3.parent).to.equal(root);
            expect(child3.index).to.equal(3);      
            
            expect(root.stringifyChildList()).to.equal(source);          
        });
    });

    describe("Node.prototype.evaluate(context)", () => {
        
        it("should return 'context.eval(expression)' where expression is the node value", async () => {
            var context = new Context();
            var node = new dom.Node("name", "1+2");
            var eval1 = await node.evaluate(context);
            var eval2 = await context.eval(node.value);
            expect(eval1).to.equal(eval2);
            expect(eval1).to.equal(3);
        });
        
        it("should attach to the context a 'self' object, being the context.Node wrapper of the node itself", async () => {
            var context = new Context()
            var node = new dom.Node("name", "self");
            var value = await node.evaluate(context);
            expect(value).to.be.instanceof(context.Node);
            expect(value.name).to.equal(node.name);
            
            node.value = "self.name";            
            var name = await node.evaluate(context);
            expect(name).to.equal(node.name);
        });
    });
    
    describe("Node.prototype.evaluateExpression(expression, context)", () => {
        
        it("should return 'context.eval(expression)'", async () => {
            var context = new Context();
            var root = dom.parse("");
            var eval1 = await root.evaluateExpression("1+2", context);
            var eval2 = await context.eval("1+2");
            expect(eval1).to.equal(eval2);
            expect(eval1).to.equal(3);
        });

        it("should attach to the context a 'self' object, being the context.Node wrapper of the document itself", async () => {
            var context = new Context()
            var root = dom.parse("");
            var value = await root.evaluateExpression("self", context);
            expect(value).to.be.instanceof(context.Node);
            expect(value.name).to.equal(root.name);
            
            var name = await root.evaluateExpression("self.name", context);
            expect(name).to.equal(root.name);
            
            var root = dom.parse(stripIndent(`
                node1: self.x
                    x: 10
                `));
            var x = await root.evaluateExpression("self.node1", context);
            expect(x).to.equal(10);
        });

        it("should attach to the context a 'root' object, being the context.Node wrapper of the document itself", async () => {
            var context = new Context()
            var root = dom.parse("");
            var value = await root.evaluateExpression("root", context);
            expect(value).to.be.instanceof(context.Node);
            expect(value.name).to.equal(root.name);
            
            var name = await root.evaluateExpression("root.name", context);
            expect(name).to.equal(root.name);
            
            var root = dom.parse(stripIndent(`
                x: 10
                node1: root.x
                `));
            var x = await root.evaluateExpression("self.node1", context);
            expect(x).to.equal(10);            
        });
    });
});
