const expect = require("chai").expect;
const stripIndent = require("strip-indent");

const Document = require("../lib/document");
const Expression = require("../lib/expression");

const Context = require("../lib/context");
const ctx = new Context();


describe("Document", () => {
    
    describe("constructor", () => {
        
        it("should return a node proxy", async () => {
            var source = stripIndent(`
                name1: 10
                name2:

                    name3: 30

                    name4:
                        name5: 50
                        
                name6: 60
                `);
                
            const doc = new Document(source);
            expect(doc.index).to.equal(0);
            expect(doc.name).to.equal("root");
            expect(doc.parent).to.be.null;
            expect(await doc.__len__()).to.equal(3);
            expect(await doc.__str__()).to.equal("\nname1: 10\nname2:\n\n    name3: 30\n\n    name4:\n        name5: 50\n        \nname6: 60\n");

            const child1 = await doc.__get__("name1");
            expect(child1).to.equal(10);
            
            const child2 = await doc.__get__("name2");
            expect(child2.index).to.equal(1);
            expect(child2.name).to.equal("name2");
            expect(child2.parent).to.equal(doc);
            expect(await child2.__len__()).to.equal(2);
            expect(await child2.__str__()).to.equal("\nname3: 30\n\nname4:\n    name5: 50\n    ");
            
            const child3 = await child2.__get__("name3");
            expect(child3).to.equal(30);
            
            const child4 = await child2.__get__("name4");
            expect(child4.index).to.equal(1);
            expect(child4.name).to.equal("name4");
            expect(child4.parent).to.equal(child2);
            expect(await child4.__len__()).to.equal(1);
            expect(await child4.__str__()).to.equal("name5: 50\n");
            
            const child5 = await child4.__get__("name5");
            expect(child5).to.equal(50);
            
            const child6 = await doc.__get__("name6");
            expect(child6).to.equal(60);
            
            expect(await doc.__get__(0)).to.equal(child1);
            expect(await doc.__get__(1)).to.equal(child2);
            expect(await child2.__get__(0)).to.equal(child3);
            expect(await child2.__get__(1)).to.equal(child4);
            expect(await child4.__get__(0)).to.equal(child5);
            expect(await doc.__get__(2)).to.equal(child6);
        });
    });
    
    describe.skip("value = Document.prototype.get(key)", () => {
        
        it("should return the value mapped to `key`, if a string", (done) => {
            async function runtest () {
                const doc = new Document( stripIndent(`
                    x: 10
                    y: root.z * 3
                    z: root.x + 1
                    `));
                    
                expect(await doc.get('x')).to.equal(10);
                expect(await doc.get('y')).to.equal(33);
                expect(await doc.get('z')).to.equal(11);
            }
            runtest().then(done).catch(done);            
        });
        
        it("should return the key-th item, if `key` is a number", (done) => {
            async function runtest () {
                const doc = new Document( stripIndent(`
                    x: 10
                    root.x + 1
                    root[1] * 3
                    `));
                    
                expect(await doc.get(0)).to.equal(10);
                expect(await doc.get(1)).to.equal(11);
                expect(await doc.get(2)).to.equal(33);
            }
            runtest().then(done).catch(done);            
        });
        
        it("should return `undefined` if `key` doesn't exist", (done) => {
            async function runtest () {
                const doc = new Document( stripIndent(`
                    x: 10
                    root.x + 1
                    root[1] * 3
                    `));
                    
                expect(await doc.get("z")).to.be.undefined;
                expect(await doc.get(5)).to.be.undefined;
            }
            runtest().then(done).catch(done);                        
        });
        
        it("should return a NodeProxy if the expression is empty", (done) => {
            async function runtest () {
                const doc = new Document( stripIndent(`
                    node:
                        item0: 10
                        item1: 11
                        item2: 12
                    `));

                const node = await doc.get('node');
                expect(node).to.be.instanceof(Document.NodeProxy);

                expect(await node.get('item0')).to.equal(10);
                expect(await node.get('item1')).to.equal(11);
                expect(await node.get('item2')).to.equal(12);
                expect(await node.get('item3')).to.be.undefined;

                expect(await node.get(0)).to.equal(10);
                expect(await node.get(1)).to.equal(11);
                expect(await node.get(2)).to.equal(12);
                expect(await node.get(3)).to.be.undefined;
            }
            runtest().then(done).catch(done);                                    
        });

        // it("should retun the document child proxies", (done) => {
        //     async function runtest () {
        //         const source = stripIndent(`
        //             z: self.get("a") + self.get(1) + self.c
        //                 a: 100
        //                 b: 10
        //                 c: 1
        //             b: self.f(30)
        //                 f: (z) -> self.x + this.y + z
        //                     x: 10
        //                 y: 20
        //             m: Markdown(self, context)
        //                 # {{root.title}}
        //             title: "Title"
        //             `);
        // 
        //         const doc = new Document(source);
        // 
        //         expect(await doc.get('b')).to.equal(60)
        // 
        //         expect(await doc.get('m')).to.equal(`<h1 id="title">Title</h1>\n`)
        //     }
        //     runtest().then(done).catch(done);
        // });        
    });
    
    describe.skip("Document context", () => {
        
        describe("self", () => {
            
            it("should be the NodeProxy of the current node", (done) => {
                async function runtest () {
                    const doc = new Document(stripIndent(`
                        node1: self
                            a: 10
                            b: 20
                            c: 30
                        `));

                    const node = await doc.get('node1')
                    expect(node).to.be.instanceof(Document.NodeProxy);
                    expect(node.__len__()).to.equal(3);
                    expect(await node.get('a')).to.equal(10);
                    expect(await node.get('b')).to.equal(20);
                    expect(await node.get('c')).to.equal(30);
                }
                runtest().then(done).catch(done);
            });
            
            it("should allow access to children via dot-notation and get function", (done) => {
                async function runtest () {
                    const source = stripIndent(`
                        z: self.get("a") + self.get(1) + self.c
                            a: 100
                            b: 10
                            c: 1
                        b: self.f(30)
                            f: (z) -> self.x + this.y + z
                                x: 10
                            y: 20
                        `);
            
                    const doc = new Document(source);            
                    expect(await doc.get('b')).to.equal(60)
                }
                runtest().then(done).catch(done);                
            });
            
            it("should give access to its own index through the .index propterty", (done) => {
                async function runtest () {
                    const source = stripIndent(`
                        first: self.index
                        self.index
                        `);
            
                    const doc = new Document(source);            
                    expect(await doc.get('first')).to.equal(0)
                    expect(await doc.get(1)).to.be.equal(1);
                }
                runtest().then(done).catch(done);                    
            });
            
            it("should give access to its own name through the .name propterty", (done) => {
                async function runtest () {
                    const source = stripIndent(`
                        myname: self.name
                        self.name
                        `);
            
                    const doc = new Document(source);            
                    expect(await doc.get('myname')).to.equal("myname")
                    expect(await doc.get(1)).to.be.undefined;
                }
                runtest().then(done).catch(done);                
            });
            
            it("should give access to its own parent through the .parent propterty", (done) => {
                async function runtest () {
                    const source = stripIndent(`
                        node_1:
                            child_11: self.parent
                        node_2:
                            child_21:
                                child_211: self.parent.parent
                        `);
            
                    const doc = new Document(source);     
                    
                    const node_1 = await doc.get('node_1');
                    const child_11 = await node_1.get('child_11');
                    expect(child_11).to.be.instanceof(Document.NodeProxy);
                    expect(child_11._node).to.equal(node_1._node);

                    const node_2 = await doc.get('node_2');
                    const child_21 = await node_2.get('child_21');
                    const child_211 = await child_21.get('child_211');
                    expect(child_211).to.be.instanceof(Document.NodeProxy);
                    expect(child_211._node).to.equal(node_2._node);
                }
                runtest().then(done).catch(done);                                
            });
        });
        
        describe("globals", () => {
            it("should point to the context itself", (done) => {
                async function runtest () {
                    const doc = new Document(stripIndent(`
                        node: globals
                        `));
                    const node = await doc.get('node');
                    expect(node).to.equal(doc._context);
                }
                runtest().then(done).catch(done);
            });
        });
        
        describe("len(obj)", () => {
            
            it("should return the number of items of a node", (done) => {
                async function runtest () {
                    const doc = new Document( stripIndent(`
                        node1: len(self)
                            10
                            20
                            30
                            40
                        node2:
                            100
                            200
                            300
                        node3: len(root.node2)
                        `));
                        
                    expect(await doc.get('node1')).to.equal(4);
                    expect(await doc.get('node3')).to.equal(3);
                }
                runtest().then(done).catch(done);                
            });
            
            it("should return the length of a string", (done) => {
                async function runtest () {
                    const doc = new Document( stripIndent(`
                        node1: "abcdef"
                        node2: len(root.node1)
                        `));
                        
                    expect(await doc.get('node2')).to.equal(6);
                }
                runtest().then(done).catch(done);                
                
            });
            
            it.skip("should return the number of items of an array", (done) => {});
            
            it.skip("should return the number of items of an plain object", (done) => {});
        });
    
        describe("Text(node)", () => {
            it("should return the child source as plain text", (done) => {
                async function runtest () {
                    const doc = new Document(stripIndent(`
                        text: Text(self)
                            This is just plain text
                            returned as it is.
                        `));
                    const text = await doc.get('text');
                    expect(text).to.equal(`This is just plain text\nreturned as it is.\n\n`)
                }
                runtest().then(done).catch(done);                    
            });            
        });
        
        describe("Template(node, context)", () => {
            it("should render the node content as a text template in the given context", (done) => {
                async function runtest () {
                    const doc = new Document(stripIndent(`
                        node: Template(self, globals)
                            This is a {{root.description}}
                        description: "text template"
                        `));
                    const node = await doc.get('node');
                    expect(node).to.equal("This is a text template\n");
                }
                runtest().then(done).catch(done);
            });                        
        });
        
        describe("Markdown(node, context)", () => {
            it("should work", (done) => {
                async function runtest () {
                    const source = stripIndent(`
                        node: Markdown(self, globals)
                            # {{root.title}}
                        title: "Title"
                        `);
            
                    const doc = new Document(source);
                    const node = await doc.get('node');
                    expect(node).to.equal(`<h1 id="title">Title</h1>\n`)
                }
                runtest().then(done).catch(done);
            });                        
        });
    });

    describe.skip("String(doc)", () => {

        it("Should return the original source", () => {
            var source = stripIndent(`
                name1: value1
                name2: value2

                    name3: value3

                    name4: value4
                        name5: value5
                        
                name6: value6
                `);
                
            const doc = new Document(source);
            source = source.replace(/\s+$/mg, "\n") + "\n";
            expect(String(doc)).to.equal(source);
        });            
    });
});
