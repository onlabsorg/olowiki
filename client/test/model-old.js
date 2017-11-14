
const model = require("model");


suite("model.Node", () => {
    const Node = model.Node;

    test("model.Node.prototype.name", () => {
        var node;

        // getter
        node = new Node({name:"test-node-1"});
        expect(node.name).to.equal("test-node-1");

        // setter
        node.name = "test-node-2";
        expect(node.name).to.equal("test-node-2");

        //default
        node = new Node();
        expect(node.name).to.equal("node1");
        node = new Node();
        expect(node.name).to.equal("node2");
    });

    test("model.Node.prototype.template", () => {
        var node;

        //getter
        node = new Node({template:"abc"});
        expect(node.template).to.equal("abc");

        //setter
        node.template = "def";
        expect(node.template).to.equal("def");

        //default
        node = new Node();
        expect(node.template).to.equal("");
    });

    test("model.Node.prototype.getChild(index)", () => {
        var child1 = new Node({name: "child1"});

        var node = new Node({children: [
            {name: "child0"},
            child1,
            {name: "child2"}
        ]});

        var child0 = node.getChild(0);
        expect(child0).to.be.instanceof(Node);
        expect(child0.name).to.equal("child0");

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

    test("model.Node.prototype.size", () => {
        var node;

        node = new Node({children: [{}, {}, {}]});
        expect(node.size).to.equal(3);

        node = new Node({children: [{}, {}]});
        expect(node.size).to.equal(2);

        node = new Node({children: []});
        expect(node.size).to.equal(0);

        node = new Node({children: "non-array-value"});
        expect(node.size).to.equal(0);

        node = new Node();
        expect(node.size).to.equal(0);
    });

    test("model.Node.prototype.children()", () => {
        var node = new Node({children: [{}, {}, {}]});
        const child0 = node.getChild(0);
        const child1 = node.getChild(1);
        const child2 = node.getChild(2);

        expect(node.children()[Symbol.iterator]).is.a("function");
        expect(Array.from(node.children())).to.deep.equal([child0, child1, child2]);
    });

    test("model.Node.prototype.getChildByName(name)", () => {
        var node = new Node({name: "root", children: [
            {name: "child0"},
            {name: "child1"},
            {name: "child2"}
        ]});
        expect(node.getChildByName("child0")).to.equal(node.getChild(0));
        expect(node.getChildByName("child1")).to.equal(node.getChild(1));
        expect(node.getChildByName("child2")).to.equal(node.getChild(2));
        expect(node.getChildByName("child3")).to.be.null;
    });

    test("model.Node.prototype.setChild(index, node)", () => {
        var node = new Node({children: [{}, {}, {}]});
        const child0 = node.getChild(0);
        const child1 = node.getChild(1);
        const child2 = node.getChild(2);

        const newChild1 = new Node();
        node.setChild(1, newChild1);
        expect(node.getChild(1)).to.equal(newChild1);

        //it should consider negative indexes as relative to the end
        const newChild2 = new Node();
        node.setChild(-1, newChild2);
        expect(node.getChild(2)).to.equal(newChild2);

        //it should throw an exception if the index is out of range
        const newChild = new Node();
        expect(() => node.setChild(3, newChild)).to.throw();
        expect(() => node.setChild(-4, newChild)).to.throw();
        expect(() => node.setChild(100, newChild)).to.throw();
        expect(() => node.setChild(-100, newChild)).to.throw();
        expect(Array.from(node.children())).to.deep.equal([child0, newChild1, newChild2]);

        //it should throw an exception if the new child node is not a Node instanceof
        expect(() => node.setChild(1, {})).to.throw();
        expect(() => node.setChild(1, [])).to.throw();
        expect(() => node.setChild(1, "abc")).to.throw();
        expect(() => node.setChild(1, null)).to.throw();
        expect(() => node.setChild(1)).to.throw();
        expect(Array.from(node.children())).to.deep.equal([child0, newChild1, newChild2]);
    });

    test("model.Node.prototype.insertChild(index, node)", () => {
        var node = new Node({children: [{}, {}, {}]});
        const child0 = node.getChild(0);
        const child1 = node.getChild(1);
        const child2 = node.getChild(2);

        const child12 = new Node();
        node.insertChild(2, child12);
        expect(Array.from(node.children())).to.deep.equal([child0, child1, child12, child2]);

        const child3 = new Node();
        node.insertChild(node.size, child3);
        expect(Array.from(node.children())).to.deep.equal([child0, child1, child12, child2, child3]);

        //it should consider negative indexes as relative to the end
        const child23 = new Node();
        node.insertChild(-1, child23);
        expect(Array.from(node.children())).to.deep.equal([child0, child1, child12, child2, child23, child3]);

        //it should throw an exception if the index is out of range
        const newChild = new Node();
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
    });

    test("model.Node.prototype.appendChild(node)", () => {
        var node = new Node({children: [{}, {}, {}]});
        const child0 = node.getChild(0);
        const child1 = node.getChild(1);
        const child2 = node.getChild(2);

        const child3 = new Node();
        node.appendChild(child3);
        expect(Array.from(node.children())).to.deep.equal([child0, child1, child2, child3]);

        //it should throw an exception if the new child node is not a Node instanceof
        expect(() => node.appendChild({})).to.throw();
        expect(() => node.appendChild([])).to.throw();
        expect(() => node.appendChild("abc")).to.throw();
        expect(() => node.appendChild(null)).to.throw();
        expect(() => node.appendChild()).to.throw();
        expect(Array.from(node.children())).to.deep.equal([child0, child1, child2, child3]);
    });

    test("model.Node.prototype.removeChild(index, node)", () => {
        var node = new Node({children: [{}, {}, {}, {}, {}]});
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

    test("model.Node.prototype.parent", () => {
        const node = new Node({children: [{}, {}, {}]});
        const child0 = node.getChild(0);
        const child1 = node.getChild(1);
        const child2 = node.getChild(2);

        expect(node.parent).to.be.null;
        expect(child0.parent).to.equal(node);
        expect(child1.parent).to.equal(node);
        expect(child2.parent).to.equal(node);

        //setChild
        const newChild1 = new Node();
        expect(newChild1.parent).to.be.null;
        node.setChild(1, newChild1);
        expect(child1.parent).to.be.null;
        expect(newChild1.parent).to.equal(node);

        //insertChild
        const child12 = new Node();
        expect(child12.parent).to.be.null;
        node.insertChild(2, child12);
        expect(child12.parent).to.equal(node);

        //appendChild
        const child4 = new Node();
        expect(child4.parent).to.be.null;
        node.appendChild(child4);
        expect(child4.parent).to.equal(node);

        //removeChild
        const child01 = new Node();
        node.insertChild(1, child01);
        expect(child01.parent).to.equal(node);
        node.removeChild(1);
        expect(child01.parent).to.be.null;

        //prevent node duplication
        const node1 = new Node({children: [{}]});
        const child = node1.getChild(0);
        expect(() => new Node({children: [child]})).to.throw();
        const node2 = new Node({children: [{}, {}, {}]});
        expect(() => node2.setChild(1, child)).to.throw();
        expect(() => node2.insertChild(1, child)).to.throw();
        expect(() => node2.appendChild(child)).to.throw();
    });

    test("model.Node.prototype.path", () => {
        var node = new Node({name:"root", children: [
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

    test("model.Node.prototype.index", () => {
        const node = new Node({children: [{}, {}, {}]});
        const child0 = node.getChild(0);
        const child1 = node.getChild(1);
        const child2 = node.getChild(2);

        expect(child0.index).to.equal(0);
        expect(child1.index).to.equal(1);
        expect(child2.index).to.equal(2);
        expect(node.index).to.be.undefined;
    });

    test("model.Node.prototype.root", () => {
        var node = new Node({
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

    test("model.Node.prototype.readonly", () => {
        var readonly;
        class RootNode extends Node {
            get readonly () {return readonly}
        }

        var node = new RootNode({name:"root", children: [
            {name: "child", children: [
                {name: "grandchild"}
            ]}
        ]});
        var child = node.getChild(0);
        var grandchild = child.getChild(0);

        readonly = true;
        expect(node.readonly).to.be.true;
        expect(child.readonly).to.be.true;
        expect(grandchild.readonly).to.be.true;

        readonly = false;
        expect(node.readonly).to.be.false;
        expect(child.readonly).to.be.false;
        expect(grandchild.readonly).to.be.false;
    });

    test("model.Document.prototype.getNode(path)", () => {
        const node = new Node({name: "root", children: [
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

    test("model.Node.prototype.render", (done) => {
        const node = new Node({
            name: "root",
            template: '{% import "./childSum" as s %}{% import "childX" as x%}s = {{s.v+x.v}}',
            children: [
                {
                    name: "childX",
                    template: '{% set v = 10 %}v = {{v}}',
                    children: []
                },
                {
                    name: "childY",
                    template: '{% set v = 20 %}v = {{v}}',
                    children: []
                },
                {
                    name: "childZ",
                    template: '{% set v = 30 %}v = {{v}}',
                    children: []
                },
                {
                    name: "childSum",
                    template: '{% import "../childX" as x %}{% import "../childY" as y %}{% import "../childZ" as z %}{% set v = x.v + y.v + z.v %}v = {{v}}',
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

    suite("model.Node change events", () => {
        var node, child, grandchild, setCallbacks, clearCallbacks;

        setup(() => {
            node = new Node({
                name: "root",
                template: "root template",
                children: [
                    {
                        name: "child",
                        template: "child0 template",
                        children: [
                            {
                                name: "grandchild",
                                template: "grandchild template",
                                children: []
                            }
                        ]
                    },
                ]
            });

            child = node.getChild(0);
            grandchild = child.getChild(0);

            setCallbacks = (cbs) => {
                node.beforeChangeCallbacks.add(cbs.nodeBeforeChangeCallback);
                node.afterChangeCallbacks.add(cbs.nodeAfterChangeCallback);

                child.beforeChangeCallbacks.add(cbs.childBeforeChangeCallback);
                child.afterChangeCallbacks.add(cbs.childAfterChangeCallback);

                grandchild.beforeChangeCallbacks.add(cbs.grandchildBeforeChangeCallback);
                grandchild.afterChangeCallbacks.add(cbs.grandchildAfterChangeCallback);
            }

            clearCallbacks = () => {
                node.beforeChangeCallbacks = new Set();
                node.afterChangeCallbacks = new Set();

                child.beforeChangeCallbacks = new Set();
                child.afterChangeCallbacks = new Set();

                grandchild.beforeChangeCallbacks = new Set();
                grandchild.afterChangeCallbacks = new Set();
            }
        });

        test("name set", () => {
            setCallbacks({

                grandchildBeforeChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "set-name",
                        oldValue: "grandchild",
                        newValue: "new grandchild name",
                        path: [grandchild]
                    });
                    expect(grandchild.name).to.equal("grandchild");
                    change.preProcessedBy = [grandchild];
                },

                childBeforeChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "set-name",
                        oldValue: "grandchild",
                        newValue: "new grandchild name",
                        path: [child, grandchild],

                        preProcessedBy: [grandchild]
                    });
                    expect(grandchild.name).to.equal("grandchild");
                    change.preProcessedBy.push(child);
                },

                nodeBeforeChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "set-name",
                        oldValue: "grandchild",
                        newValue: "new grandchild name",
                        path: [node, child, grandchild],

                        preProcessedBy: [grandchild, child]
                    });
                    expect(grandchild.name).to.equal("grandchild");
                    change.preProcessedBy.push(node);
                },

                grandchildAfterChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "set-name",
                        oldValue: "grandchild",
                        newValue: "new grandchild name",
                        path: [grandchild],

                        preProcessedBy: [grandchild, child, node]
                    });
                    expect(grandchild.name).to.equal("new grandchild name");
                    change.postProcessedBy = [grandchild];
                },

                childAfterChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "set-name",
                        oldValue: "grandchild",
                        newValue: "new grandchild name",
                        path: [child, grandchild],

                        preProcessedBy: [grandchild, child, node],
                        postProcessedBy: [grandchild]
                    });
                    expect(grandchild.name).to.equal("new grandchild name");
                    change.postProcessedBy.push(child);
                },

                nodeAfterChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "set-name",
                        oldValue: "grandchild",
                        newValue: "new grandchild name",
                        path: [node, child, grandchild],

                        preProcessedBy: [grandchild, child, node],
                        postProcessedBy: [grandchild, child]
                    });
                    expect(grandchild.name).to.equal("new grandchild name");
                    change.postProcessedBy.push(node);
                }
            });

            grandchild.name = "new grandchild name";

            clearCallbacks();
        });

        test("template set", () => {
            setCallbacks({

                grandchildBeforeChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "set-template",
                        oldValue: "grandchild template",
                        newValue: "new grandchild template",
                        path: [grandchild]
                    });
                    expect(grandchild.template).to.equal("grandchild template");
                    change.preProcessedBy = [grandchild];
                },

                childBeforeChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "set-template",
                        oldValue: "grandchild template",
                        newValue: "new grandchild template",
                        path: [child, grandchild],

                        preProcessedBy: [grandchild]
                    });
                    expect(grandchild.template).to.equal("grandchild template");
                    change.preProcessedBy.push(child);
                },

                nodeBeforeChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "set-template",
                        oldValue: "grandchild template",
                        newValue: "new grandchild template",
                        path: [node, child, grandchild],

                        preProcessedBy: [grandchild, child]
                    });
                    expect(grandchild.template).to.equal("grandchild template");
                    change.preProcessedBy.push(node);
                },

                grandchildAfterChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "set-template",
                        oldValue: "grandchild template",
                        newValue: "new grandchild template",
                        path: [grandchild],

                        preProcessedBy: [grandchild, child, node]
                    });
                    expect(grandchild.template).to.equal("new grandchild template");
                    change.postProcessedBy = [grandchild];
                },

                childAfterChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "set-template",
                        oldValue: "grandchild template",
                        newValue: "new grandchild template",
                        path: [child, grandchild],

                        preProcessedBy: [grandchild, child, node],
                        postProcessedBy: [grandchild]
                    });
                    expect(grandchild.template).to.equal("new grandchild template");
                    change.postProcessedBy.push(child);
                },

                nodeAfterChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "set-template",
                        oldValue: "grandchild template",
                        newValue: "new grandchild template",
                        path: [node, child, grandchild],

                        preProcessedBy: [grandchild, child, node],
                        postProcessedBy: [grandchild, child]
                    });
                    expect(grandchild.template).to.equal("new grandchild template");
                    change.postProcessedBy.push(node);
                }
            });

            grandchild.template = "new grandchild template";

            clearCallbacks();
        });

        test("child set", () => {
            const oldNode = new Node();
            const newNode = new Node();
            grandchild.appendChild(oldNode);

            setCallbacks({

                grandchildBeforeChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "set-child",
                        index: 0,
                        oldValue: oldNode,
                        newValue: newNode,
                        path: [grandchild]
                    });
                    expect(grandchild.getChild(0)).to.equal(oldNode);
                    change.preProcessedBy = [grandchild];
                },

                childBeforeChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "set-child",
                        index: 0,
                        oldValue: oldNode,
                        newValue: newNode,
                        path: [child, grandchild],

                        preProcessedBy: [grandchild]
                    });
                    expect(grandchild.getChild(0)).to.equal(oldNode);
                    change.preProcessedBy.push(child);
                },

                nodeBeforeChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "set-child",
                        index: 0,
                        oldValue: oldNode,
                        newValue: newNode,
                        path: [node, child, grandchild],

                        preProcessedBy: [grandchild, child]
                    });
                    expect(grandchild.getChild(0)).to.equal(oldNode);
                    change.preProcessedBy.push(node);
                },

                grandchildAfterChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "set-child",
                        index: 0,
                        oldValue: oldNode,
                        newValue: newNode,
                        path: [grandchild],

                        preProcessedBy: [grandchild, child, node]
                    });
                    expect(grandchild.getChild(0)).to.equal(newNode);
                    change.postProcessedBy = [grandchild];
                },

                childAfterChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "set-child",
                        index: 0,
                        oldValue: oldNode,
                        newValue: newNode,
                        path: [child, grandchild],

                        preProcessedBy: [grandchild, child, node],
                        postProcessedBy: [grandchild]
                    });
                    expect(grandchild.getChild(0)).to.equal(newNode);
                    change.postProcessedBy.push(child);
                },

                nodeAfterChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "set-child",
                        index: 0,
                        oldValue: oldNode,
                        newValue: newNode,
                        path: [node, child, grandchild],

                        preProcessedBy: [grandchild, child, node],
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
            grandchild.appendChild(new Node());
            grandchild.appendChild(new Node());
            const newNode = new Node();
            const oldSize = grandchild.size;

            setCallbacks({

                grandchildBeforeChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "insert-child",
                        index: 1,
                        value: newNode,
                        path: [grandchild]
                    });
                    expect(grandchild.size).to.equal(oldSize);
                    change.preProcessedBy = [grandchild];
                },

                childBeforeChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "insert-child",
                        index: 1,
                        value: newNode,
                        path: [child, grandchild],

                        preProcessedBy: [grandchild]
                    });
                    expect(grandchild.size).to.equal(oldSize);
                    change.preProcessedBy.push(child);
                },

                nodeBeforeChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "insert-child",
                        index: 1,
                        value: newNode,
                        path: [node, child, grandchild],

                        preProcessedBy: [grandchild, child]
                    });
                    expect(grandchild.size).to.equal(oldSize);
                    change.preProcessedBy.push(node);
                },

                grandchildAfterChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "insert-child",
                        index: 1,
                        value: newNode,
                        path: [grandchild],

                        preProcessedBy: [grandchild, child, node]
                    });
                    expect(grandchild.size).to.equal(oldSize+1);
                    expect(grandchild.getChild(1)).to.equal(newNode);
                    change.postProcessedBy = [grandchild];
                },

                childAfterChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "insert-child",
                        index: 1,
                        value: newNode,
                        path: [child, grandchild],

                        preProcessedBy: [grandchild, child, node],
                        postProcessedBy: [grandchild]
                    });
                    expect(grandchild.size).to.equal(oldSize+1);
                    expect(grandchild.getChild(1)).to.equal(newNode);
                    change.postProcessedBy.push(child);
                },

                nodeAfterChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "insert-child",
                        index: 1,
                        value: newNode,
                        path: [node, child, grandchild],

                        preProcessedBy: [grandchild, child, node],
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
            grandchild.appendChild(new Node());
            grandchild.appendChild(new Node());
            grandchild.appendChild(new Node());
            const newNode = new Node();
            const oldSize = grandchild.size;

            setCallbacks({

                grandchildBeforeChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "insert-child",
                        index: oldSize,
                        value: newNode,
                        path: [grandchild]
                    });
                    expect(grandchild.size).to.equal(oldSize);
                    change.preProcessedBy = [grandchild];
                },

                childBeforeChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "insert-child",
                        index: oldSize,
                        value: newNode,
                        path: [child, grandchild],

                        preProcessedBy: [grandchild]
                    });
                    expect(grandchild.size).to.equal(oldSize);
                    change.preProcessedBy.push(child);
                },

                nodeBeforeChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "insert-child",
                        index: oldSize,
                        value: newNode,
                        path: [node, child, grandchild],

                        preProcessedBy: [grandchild, child]
                    });
                    expect(grandchild.size).to.equal(oldSize);
                    change.preProcessedBy.push(node);
                },

                grandchildAfterChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "insert-child",
                        index: oldSize,
                        value: newNode,
                        path: [grandchild],

                        preProcessedBy: [grandchild, child, node]
                    });
                    expect(grandchild.size).to.equal(oldSize+1);
                    expect(grandchild.getChild(oldSize)).to.equal(newNode);
                    change.postProcessedBy = [grandchild];
                },

                childAfterChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "insert-child",
                        index: oldSize,
                        value: newNode,
                        path: [child, grandchild],

                        preProcessedBy: [grandchild, child, node],
                        postProcessedBy: [grandchild]
                    });
                    expect(grandchild.size).to.equal(oldSize+1);
                    expect(grandchild.getChild(oldSize)).to.equal(newNode);
                    change.postProcessedBy.push(child);
                },

                nodeAfterChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "insert-child",
                        index: oldSize,
                        value: newNode,
                        path: [node, child, grandchild],

                        preProcessedBy: [grandchild, child, node],
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
            grandchild.appendChild(new Node());
            grandchild.appendChild(new Node());
            grandchild.appendChild(new Node());
            const oldNode = grandchild.getChild(1);
            const oldSize = grandchild.size;

            setCallbacks({

                grandchildBeforeChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "remove-child",
                        index: 1,
                        oldValue: oldNode,
                        path: [grandchild]
                    });
                    expect(grandchild.size).to.equal(oldSize);
                    expect(grandchild.getChild(1)).to.equal(oldNode);
                    change.preProcessedBy = [grandchild];
                },

                childBeforeChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "remove-child",
                        index: 1,
                        oldValue: oldNode,
                        path: [child, grandchild],

                        preProcessedBy: [grandchild]
                    });
                    expect(grandchild.size).to.equal(oldSize);
                    expect(grandchild.getChild(1)).to.equal(oldNode);
                    change.preProcessedBy.push(child);
                },

                nodeBeforeChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "remove-child",
                        index: 1,
                        oldValue: oldNode,
                        path: [node, child, grandchild],

                        preProcessedBy: [grandchild, child]
                    });
                    expect(grandchild.size).to.equal(oldSize);
                    expect(grandchild.getChild(1)).to.equal(oldNode);
                    change.preProcessedBy.push(node);
                },

                grandchildAfterChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "remove-child",
                        index: 1,
                        oldValue: oldNode,
                        path: [grandchild],

                        preProcessedBy: [grandchild, child, node]
                    });
                    expect(grandchild.size).to.equal(oldSize-1);
                    change.postProcessedBy = [grandchild];
                },

                childAfterChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "remove-child",
                        index: 1,
                        oldValue: oldNode,
                        path: [child, grandchild],

                        preProcessedBy: [grandchild, child, node],
                        postProcessedBy: [grandchild]
                    });
                    expect(grandchild.size).to.equal(oldSize-1);
                    change.postProcessedBy.push(child);
                },

                nodeAfterChangeCallback: (change) => {
                    expect(change).to.deep.equal({
                        method: "remove-child",
                        index: 1,
                        oldValue: oldNode,
                        path: [node, child, grandchild],

                        preProcessedBy: [grandchild, child, node],
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


suite("model.Document", () => {
    const Document = model.Document;

    test("model.Document.prototype.readonly", () => {
        const rwdoc = new Document({children: [{}]});
        expect(rwdoc.readonly).to.be.false;
        expect(() => {rwdoc.getChild(0).name = "child name"}).to.not.throw();

        const rodoc = new Document({children: [{}]}, true);
        expect(rodoc.readonly).to.be.true;
        expect(() => {rodoc.getChild(0).name = "new child name"}).to.throw();
    });
});
