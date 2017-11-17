//TODO: test name duplication checks
//TODO: test same document checks

const store = require("store");
const Node = store.Node;
const Document = store.Document;

function createNode (hash={}) {
    return new Node(hash);
}

function createDocument (hash={}, readonly=false) {
    return new Document(hash, readonly);
}



suite("Node", () => {

    test("Node.prototype.name", () => {
        var node;

        // getter
        node = createNode({name:"test-node-1"});
        expect(node.name).to.equal("test-node-1");

        // setter
        node.name = "test-node-2";
        expect(node.name).to.equal("test-node-2");

        //default
        node = createNode();
        expect(node.name).to.equal(node._defaultName);

        //duplication check
        node = createNode({children: [{name:'n1'}, {name:'n2'}]});
        expect(() => {doc.getChild(0).name = 'n2'}).to.throw();
    });

    test("Node.prototype.value", () => {
        var node;

        //getter
        node = createNode({value:"abc"});
        expect(node.value).to.equal("abc");

        //setter
        node.value = "def";
        expect(node.value).to.equal("def");

        //default
        node = createNode();
        expect(node.value).to.equal("");
    });

    test("Node.prototype.getChild(index)", () => {

        var node = createNode({children: [
            {name: "child0"},
            {name: "child1"},
            {name: "child2"}
        ]});

        var child0 = node.getChild(0);
        expect(child0).to.be.instanceof(Node);
        expect(child0.name).to.equal("child0");

        var child1 = node.getChild(1);
        expect(child1).to.be.instanceof(Node);
        expect(child1.name).to.equal("child1");

        var child2 = node.getChild(2);
        expect(child2).to.be.instanceof(Node);
        expect(child2.name).to.equal("child2");

        expect(node.getChild(3)).to.be.null;

        //it should consider negative indexes as relative to the end
        expect(node.getChild(-1)).to.equal(child2);
        expect(node.getChild(-2)).to.equal(child1);
        expect(node.getChild(-3)).to.equal(child0);
        expect(node.getChild(-4)).to.be.null;
    });

    test("Node.prototype.size", () => {
        var node;

        node = createNode({children: [{}, {}, {}]});
        expect(node.size).to.equal(3);

        node = createNode({children: [{}, {}]});
        expect(node.size).to.equal(2);

        node = createNode({children: []});
        expect(node.size).to.equal(0);

        node = createNode({children: "non-array-value"});
        expect(node.size).to.equal(0);

        node = createNode();
        expect(node.size).to.equal(0);
    });

    test("Node.prototype.children()", () => {
        var node = createNode({children: [{}, {}, {}]});
        const child0 = node.getChild(0);
        const child1 = node.getChild(1);
        const child2 = node.getChild(2);

        expect(node.children()[Symbol.iterator]).is.a("function");
        expect(Array.from(node.children())).to.deep.equal([child0, child1, child2]);
    });

    test("Node.prototype.getChildByName(name)", () => {
        var node = createNode({name: "root", children: [
            {name: "child0"},
            {name: "child1"},
            {name: "child2"}
        ]});
        expect(node.getChildByName("child0")).to.equal(node.getChild(0));
        expect(node.getChildByName("child1")).to.equal(node.getChild(1));
        expect(node.getChildByName("child2")).to.equal(node.getChild(2));
        expect(node.getChildByName("child3")).to.be.null;
    });

    test("Node.prototype.setChild(index, node)", () => {
        var node = createNode({children: [{}, {}, {}]});
        const child0 = node.getChild(0);
        const child1 = node.getChild(1);
        const child2 = node.getChild(2);

        const newChild1 = createNode();
        node.setChild(1, newChild1);
        expect(node.getChild(1)).to.equal(newChild1);

        //it should consider negative indexes as relative to the end
        const newChild2 = createNode();
        node.setChild(-1, newChild2);
        expect(node.getChild(2)).to.equal(newChild2);

        //it should throw an exception if the index is out of range
        const newChild = createNode();
        expect(() => node.setChild(3, newChild)).to.throw();
        expect(() => node.setChild(-4, newChild)).to.throw();
        expect(() => node.setChild(100, newChild)).to.throw();
        expect(() => node.setChild(-100, newChild)).to.throw();
        expect(Array.from(node.children())).to.deep.equal([child0, newChild1, newChild2]);

        //it should throw an exception if the new child node is not a Node instance
        expect(() => node.setChild(1, {})).to.throw();
        expect(() => node.setChild(1, [])).to.throw();
        expect(() => node.setChild(1, "abc")).to.throw();
        expect(() => node.setChild(1, null)).to.throw();
        expect(() => node.setChild(1)).to.throw();
        expect(Array.from(node.children())).to.deep.equal([child0, newChild1, newChild2]);

        //duplication check
        node = createNode({children: [{name:'n1'}, {name:'n2'}]})
        const n2 = createNode({name:'n2'});
        expect(() => node.setChild(0, n2)).to.throw();
    });

    test("Node.prototype.insertChild(index, node)", () => {
        var node = createNode({children: [{}, {}, {}]});
        const child0 = node.getChild(0);
        const child1 = node.getChild(1);
        const child2 = node.getChild(2);

        const child12 = createNode();
        node.insertChild(2, child12);
        expect(Array.from(node.children())).to.deep.equal([child0, child1, child12, child2]);

        const child3 = createNode();
        node.insertChild(node.size, child3);
        expect(Array.from(node.children())).to.deep.equal([child0, child1, child12, child2, child3]);

        //it should consider negative indexes as relative to the end
        const child23 = createNode();
        node.insertChild(-1, child23);
        expect(Array.from(node.children())).to.deep.equal([child0, child1, child12, child2, child23, child3]);

        //it should throw an exception if the index is out of range
        const newChild = createNode();
        expect(() => node.insertChild(100, newChild)).to.throw();
        expect(() => node.insertChild(-100, newChild)).to.throw();
        expect(Array.from(node.children())).to.deep.equal([child0, child1, child12, child2, child23, child3]);

        //it should throw an exception if the new child node is not a Node instanceof
        expect(() => node.insertChild(1, {})).to.throw();
        expect(() => node.insertChild(1, [])).to.throw();
        expect(() => node.insertChild(1, "abc")).to.throw();
        expect(() => node.insertChild(1, null)).to.throw();
        expect(() => node.insertChild(1)).to.throw();
        expect(Array.from(node.children())).to.deep.equal([child0, child1, child12, child2, child23, child3]);

        //duplication check
        node = createNode({children: [{name:'n1'}, {name:'n2'}]})
        const n2 = createNode({name:'n2'});
        expect(() => node.insertChild(1, n2)).to.throw();
    });

    test("Node.prototype.appendChild(node)", () => {
        var node = createNode({children: [{}, {}, {}]});
        const child0 = node.getChild(0);
        const child1 = node.getChild(1);
        const child2 = node.getChild(2);

        const child3 = createNode();
        node.appendChild(child3);
        expect(Array.from(node.children())).to.deep.equal([child0, child1, child2, child3]);

        //it should throw an exception if the new child node is not a Node instanceof
        expect(() => node.appendChild({})).to.throw();
        expect(() => node.appendChild([])).to.throw();
        expect(() => node.appendChild("abc")).to.throw();
        expect(() => node.appendChild(null)).to.throw();
        expect(() => node.appendChild()).to.throw();
        expect(Array.from(node.children())).to.deep.equal([child0, child1, child2, child3]);

        //duplication check
        node = createNode({children: [{name:'n1'}, {name:'n2'}]})
        const n2 = createNode({name:'n2'});
        expect(() => node.appendChild(n2)).to.throw();
    });

    test("Node.prototype.removeChild(index, node)", () => {
        var node = createNode({children: [{}, {}, {}, {}, {}]});
        const child0 = node.getChild(0);
        const child1 = node.getChild(1);
        const child2 = node.getChild(2);
        const child3 = node.getChild(3);
        const child4 = node.getChild(4);

        node.removeChild(1);
        expect(Array.from(node.children())).to.deep.equal([child0, child2, child3, child4]);

        //it should consider negative indexes as relative to the end
        node.removeChild(-2);
        expect(Array.from(node.children())).to.deep.equal([child0, child2, child4]);

        //it should throw an exception if the new child node is not a Node instanceof
        expect(() => node.removeChild(100)).to.throw();
        expect(() => node.removeChild(-100)).to.throw();
        expect(Array.from(node.children())).to.deep.equal([child0, child2, child4]);
    });

    test("Node.prototype.parent", () => {
        const node = createNode({children: [{}, {}, {}]});
        const child0 = node.getChild(0);
        const child1 = node.getChild(1);
        const child2 = node.getChild(2);

        expect(node.parent).to.be.null;
        expect(child0.parent).to.equal(node);
        expect(child1.parent).to.equal(node);
        expect(child2.parent).to.equal(node);

        //setChild
        const newChild1 = createNode();
        expect(newChild1.parent).to.be.null;
        node.setChild(1, newChild1);
        expect(child1.parent).to.be.null;
        expect(newChild1.parent).to.equal(node);

        //insertChild
        const child12 = createNode();
        expect(child12.parent).to.be.null;
        node.insertChild(2, child12);
        expect(child12.parent).to.equal(node);

        //appendChild
        const child4 = createNode();
        expect(child4.parent).to.be.null;
        node.appendChild(child4);
        expect(child4.parent).to.equal(node);

        //removeChild
        const child01 = createNode();
        node.insertChild(1, child01);
        expect(child01.parent).to.equal(node);
        node.removeChild(1);
        expect(child01.parent).to.be.null;

        //prevent node duplication
        const node1 = createNode({children: [{}]});
        const child = node1.getChild(0);
        expect(() => createNode({children: [child]})).to.throw();
        const node2 = createNode({children: [{}, {}, {}]});
        expect(() => node2.setChild(1, child)).to.throw();
        expect(() => node2.insertChild(1, child)).to.throw();
        expect(() => node2.appendChild(child)).to.throw();
    });

    test("Node.prototype.path", () => {
        var node = createNode({name:"root", children: [
            {name:"child", children: [
                {name:"grandchild"}
            ]}
        ]})
        var child = node.getChild(0);
        var grandchild = child.getChild(0);

        expect(node.path).to.equal("/");
        expect(child.path).to.equal("/child");
        expect(grandchild.path).to.equal("/child/grandchild");
    });

    test("Node.prototype.index", () => {
        const node = createNode({children: [{}, {}, {}]});
        const child0 = node.getChild(0);
        const child1 = node.getChild(1);
        const child2 = node.getChild(2);

        expect(child0.index).to.equal(0);
        expect(child1.index).to.equal(1);
        expect(child2.index).to.equal(2);
        expect(node.index).to.be.undefined;
    });

    test("Node.prototype.root", () => {
        var node = createNode({
            children: [
                {
                    children: [{}, {}, {}]
                }
            ]
        });
        expect(node.getChild(0).getChild(0).root).to.equal(node);
        expect(node.getChild(0).getChild(1).root).to.equal(node);
        expect(node.getChild(0).getChild(2).root).to.equal(node);
        expect(node.getChild(0).root).to.equal(node);
        expect(node.root).to.equal(node);
    });

    test("Node.prototype.readonly", () => {
        var node = createNode({name:"root", children: [
            {name: "child", children: [
                {name: "grandchild"}
            ]}
        ]});
        var child = node.getChild(0);
        var grandchild = child.getChild(0);

        node._parent = {readonly: true};
        expect(node.readonly).to.be.true;
        expect(child.readonly).to.be.true;
        expect(grandchild.readonly).to.be.true;

        node._parent = {readonly: false};
        expect(node.readonly).to.be.false;
        expect(child.readonly).to.be.false;
        expect(grandchild.readonly).to.be.false;
    });

    test("Node.prototype.getNode(path)", () => {
        const node = createNode({name: "root", children: [
                {name: "child0", children: [
                    {name: "grandchild"}
                ]},
                {name: "child1", children: []},
            ]
        });

        const child0 = node.getChild(0);
        const child1 = node.getChild(1);
        const grandchild = child0.getChild(0);

        expect(node.getNode("child0")).to.equal(child0);
        expect(node.getNode("./child0")).to.equal(child0);
        expect(node.getNode("/child0")).to.equal(child0);

        expect(node.getNode("child0/grandchild")).to.equal(grandchild);
        expect(node.getNode("./child0/grandchild")).to.equal(grandchild);
        expect(node.getNode("/child0/grandchild")).to.equal(grandchild);

        expect(child1.getNode("../child0")).to.equal(child0);
        expect(child1.getNode("/child0")).to.equal(child0);

        expect(child1.getNode("../child0/grandchild")).to.equal(grandchild);
        expect(child1.getNode("/child0/grandchild")).to.equal(grandchild);
    });

    test("Node.prototype.assign", () => {
        var node = createNode({name:"n0", value:"t0", children: [
            {name:"n1", value:"t1", children:[{},{},{}]},
            {name:"n2", value:"t2", children:[{},{},{}]},
            {name:"n3", value:"t3", children:[{},{},{}]},
        ]});
        node.assign({name:"N0", value:"T0", children: [
            {name:"N1", value:"T1", children:[{},{},{},{}]},
            {name:"N2", value:"T2", children:[{},{},{},{}]},
        ]});
        expect(node.name).to.equal("N0");
        expect(node.value).to.equal("T0");
        expect(node.size).to.equal(2);
        expect(node.getChild(0).name).to.equal("N1");
        expect(node.getChild(0).value).to.equal("T1");
        expect(node.getChild(0).size).to.equal(4);
        expect(node.getChild(1).name).to.equal("N2");
        expect(node.getChild(1).value).to.equal("T2");
        expect(node.getChild(1).size).to.equal(4);
    });

    test("Node.prototype.export", () => {
        const obj = {name:"n0", value:"t0", children: [
            {name:"n1", value:"t1", children:[
                {name:"n10", value:"t10", children:[]},
                {name:"n11", value:"t11", children:[]},
            ]},
            {name:"n2", value:"t2", children:[]},
        ]};
        const node = createNode(obj);
        expect(node.export()).to.deep.equal(obj);

    });

    test("Node.prototype.render()", (done) => {
        const node = createNode({
            name: "root",
            value: '{% import "./childSum" as s %}{% import "childX" as x%}s = {{s.v+x.v}}',
            children: [
                {
                    name: "childX",
                    value: '{% set v = 10 %}v = {{v}}',
                    children: []
                },
                {
                    name: "childY",
                    value: '{% set v = 20 %}v = {{v}}',
                    children: []
                },
                {
                    name: "childZ",
                    value: '{% set v = 30 %}v = {{v}}',
                    children: []
                },
                {
                    name: "childSum",
                    value: '{% import "../childX" as x %}{% import "../childY" as y %}{% import "../childZ" as z %}{% set v = x.v + y.v + z.v %}v = {{v}}',
                    children: []
                },
            ]
        });

        async function run () {
            const childX_rendering = await node.getChildByName("childX").render();
            expect(childX_rendering).to.equal("v = 10");

            const childY_rendering = await node.getChildByName("childY").render();
            expect(childY_rendering).to.equal("v = 20");

            const childZ_rendering = await node.getChildByName("childZ").render();
            expect(childZ_rendering).to.equal("v = 30");

            const childSum_rendering = await node.getChildByName("childSum").render();
            expect(childSum_rendering).to.equal("v = 60");

            const node_rendering = await node.render();
            expect(node_rendering).to.equal("s = 70");
        }

        run().then(done).catch(done);
    });

    suite("Node change events", () => {
        var node, child, grandchild, setCallbacks, clearCallbacks;

        setup(() => {
            node = createNode({
                name: "root",
                value: "root value",
                children: [
                    {
                        name: "child",
                        value: "child0 value",
                        children: [
                            {
                                name: "grandchild",
                                value: "grandchild value",
                                children: []
                            }
                        ]
                    },
                ]
            });

            child = node.getChild(0);
            grandchild = child.getChild(0);

            setCallbacks = (cbs) => {
                node.changeCallbacks.add(cbs.nodeChangeCallback);
                child.changeCallbacks.add(cbs.childChangeCallback);
                grandchild.changeCallbacks.add(cbs.grandchildChangeCallback);
            }

            clearCallbacks = () => {
                node.changeCallbacks = new Set();
                child.changeCallbacks = new Set();
                grandchild.changeCallbacks = new Set();
            }
        });

        test("name set", () => {
            setCallbacks({

                grandchildChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "set-name",
                        oldValue: "grandchild",
                        newValue: "new grandchild name",
                        path: [grandchild],
                    });
                    expect(grandchild.name).to.equal("new grandchild name");
                    change.postProcessedBy = [grandchild];
                },

                childChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "set-name",
                        oldValue: "grandchild",
                        newValue: "new grandchild name",
                        path: [child, grandchild],

                        postProcessedBy: [grandchild]
                    });
                    expect(grandchild.name).to.equal("new grandchild name");
                    change.postProcessedBy.push(child);
                },

                nodeChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "set-name",
                        oldValue: "grandchild",
                        newValue: "new grandchild name",
                        path: [node, child, grandchild],

                        postProcessedBy: [grandchild, child]
                    });
                    expect(grandchild.name).to.equal("new grandchild name");
                    change.postProcessedBy.push(node);
                }
            });

            grandchild.name = "new grandchild name";

            clearCallbacks();
        });

        test("value set", () => {
            setCallbacks({

                grandchildChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "set-value",
                        oldValue: "grandchild value",
                        newValue: "new grandchild value",
                        path: [grandchild],
                    });
                    expect(grandchild.value).to.equal("new grandchild value");
                    change.postProcessedBy = [grandchild];
                },

                childChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "set-value",
                        oldValue: "grandchild value",
                        newValue: "new grandchild value",
                        path: [child, grandchild],

                        postProcessedBy: [grandchild]
                    });
                    expect(grandchild.value).to.equal("new grandchild value");
                    change.postProcessedBy.push(child);
                },

                nodeChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "set-value",
                        oldValue: "grandchild value",
                        newValue: "new grandchild value",
                        path: [node, child, grandchild],

                        postProcessedBy: [grandchild, child]
                    });
                    expect(grandchild.value).to.equal("new grandchild value");
                    change.postProcessedBy.push(node);
                }
            });

            grandchild.value = "new grandchild value";

            clearCallbacks();
        });

        test("child set", () => {
            const oldNode = createNode();
            const newNode = createNode();
            grandchild.appendChild(oldNode);

            setCallbacks({

                grandchildChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "set-child",
                        index: 0,
                        oldValue: oldNode,
                        newValue: newNode,
                        path: [grandchild],
                    });
                    expect(grandchild.getChild(0)).to.equal(newNode);
                    change.postProcessedBy = [grandchild];
                },

                childChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "set-child",
                        index: 0,
                        oldValue: oldNode,
                        newValue: newNode,
                        path: [child, grandchild],

                        postProcessedBy: [grandchild]
                    });
                    expect(grandchild.getChild(0)).to.equal(newNode);
                    change.postProcessedBy.push(child);
                },

                nodeChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "set-child",
                        index: 0,
                        oldValue: oldNode,
                        newValue: newNode,
                        path: [node, child, grandchild],

                        postProcessedBy: [grandchild, child]
                    });
                    expect(grandchild.getChild(0)).to.equal(newNode);
                    change.postProcessedBy.push(node);
                }
            });

            grandchild.setChild(0, newNode);

            clearCallbacks();
        });

        test("child insert", () => {
            grandchild.appendChild(createNode());
            grandchild.appendChild(createNode());
            const newNode = createNode();
            const oldSize = grandchild.size;

            setCallbacks({

                grandchildChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "insert-child",
                        index: 1,
                        newValue: newNode,
                        path: [grandchild],
                    });
                    expect(grandchild.size).to.equal(oldSize+1);
                    expect(grandchild.getChild(1)).to.equal(newNode);
                    change.postProcessedBy = [grandchild];
                },

                childChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "insert-child",
                        index: 1,
                        newValue: newNode,
                        path: [child, grandchild],

                        postProcessedBy: [grandchild]
                    });
                    expect(grandchild.size).to.equal(oldSize+1);
                    expect(grandchild.getChild(1)).to.equal(newNode);
                    change.postProcessedBy.push(child);
                },

                nodeChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "insert-child",
                        index: 1,
                        newValue: newNode,
                        path: [node, child, grandchild],

                        postProcessedBy: [grandchild, child]
                    });
                    expect(grandchild.size).to.equal(oldSize+1);
                    expect(grandchild.getChild(1)).to.equal(newNode);
                    change.postProcessedBy.push(node);
                }
            });

            grandchild.insertChild(1, newNode);

            clearCallbacks();
        });

        test("child append", () => {
            grandchild.appendChild(createNode());
            grandchild.appendChild(createNode());
            grandchild.appendChild(createNode());
            const newNode = createNode();
            const oldSize = grandchild.size;

            setCallbacks({

                grandchildChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "insert-child",
                        index: oldSize,
                        newValue: newNode,
                        path: [grandchild],
                    });
                    expect(grandchild.size).to.equal(oldSize+1);
                    expect(grandchild.getChild(oldSize)).to.equal(newNode);
                    change.postProcessedBy = [grandchild];
                },

                childChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "insert-child",
                        index: oldSize,
                        newValue: newNode,
                        path: [child, grandchild],

                        postProcessedBy: [grandchild]
                    });
                    expect(grandchild.size).to.equal(oldSize+1);
                    expect(grandchild.getChild(oldSize)).to.equal(newNode);
                    change.postProcessedBy.push(child);
                },

                nodeChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "insert-child",
                        index: oldSize,
                        newValue: newNode,
                        path: [node, child, grandchild],

                        postProcessedBy: [grandchild, child]
                    });
                    expect(grandchild.size).to.equal(oldSize+1);
                    expect(grandchild.getChild(oldSize)).to.equal(newNode);
                    change.postProcessedBy.push(node);
                }
            });

            grandchild.appendChild(newNode);

            clearCallbacks();
        });

        test("child remove", () => {
            grandchild.appendChild(createNode());
            grandchild.appendChild(createNode());
            grandchild.appendChild(createNode());
            const oldNode = grandchild.getChild(1);
            const oldSize = grandchild.size;

            setCallbacks({

                grandchildChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "remove-child",
                        index: 1,
                        oldValue: oldNode,
                        path: [grandchild],
                    });
                    expect(grandchild.size).to.equal(oldSize-1);
                    change.postProcessedBy = [grandchild];
                },

                childChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "remove-child",
                        index: 1,
                        oldValue: oldNode,
                        path: [child, grandchild],

                        postProcessedBy: [grandchild]
                    });
                    expect(grandchild.size).to.equal(oldSize-1);
                    change.postProcessedBy.push(child);
                },

                nodeChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "remove-child",
                        index: 1,
                        oldValue: oldNode,
                        path: [node, child, grandchild],

                        postProcessedBy: [grandchild, child]
                    });
                    expect(grandchild.size).to.equal(oldSize-1);
                    change.postProcessedBy.push(node);
                }
            });

            grandchild.removeChild(1);

            clearCallbacks();
        });
    });
});



suite("Document", () => {

    test("Document.prototype.readonly", (done) => {
        async function run () {
            const rwDoc = await createDocument({name:"n", value:"t", children:[{},{},{}]}, false);

            expect(rwDoc.readonly).to.be.false;
            expect(() => {rwDoc.name = "child name"}).to.not.throw();

            expect(rwDoc.getChild(0).readonly).to.be.false;
            expect(() => {rwDoc.getChild(0).name = "child name"}).to.not.throw();


            const roDoc = await createDocument({name:"n", value:"t", children:[{},{},{}]}, true);

            expect(roDoc.readonly).to.be.true;
            expect(() => {roDoc.name = "new child name"}).to.throw();

            expect(roDoc.getChild(0).readonly).to.be.true;
            expect(() => {roDoc.getChild(0).name = "new child name"}).to.throw();
        }
        run().then(done).catch(done);
    });
});
