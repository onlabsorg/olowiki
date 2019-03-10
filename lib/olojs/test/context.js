
var expect = require("chai").expect;
var stripIndent = require("strip-indent");

var Context = require("../lib/context");
var dom = require("../lib/dom");


suite("Context", () => {
    
    test("Context.prototype.eval", async () => {
        var context = new Context();
        context.x = 10;
        var value = await context.eval("2*x");
        expect(value).to.equal(20);
    });    
    
    test("Context.prototype.Node", async () => {
        var context = new Context();
        context.x = 10;
        
        var domChild1 = new dom.Node("child1", "x*1");
        var domChild2 = new dom.Node("child2", "x*2");
        var domChild3 = new dom.Node("child3", "x*3");
        var domChild4 = new dom.Node("child4", "");
        var domNode = new dom.Node("name", "value", [domChild1, domChild2, domChild3, domChild4]);
        var node = context.Node(domNode);
        
        expect(node.name).to.equal(domNode.name);
        expect(node.index).to.equal(0);
        
        expect(await node.__get__(1)).to.equal(10);
        expect(await node.__get__(2)).to.equal(20);
        expect(await node.__get__(3)).to.equal(30);
        expect(await node.__get__(-4)).to.equal(10);
        expect(await node.__get__(-3)).to.equal(20);
        expect(await node.__get__(-2)).to.equal(30);
        expect(await node.__get__("child1")).to.equal(10);
        expect(await node.__get__("child2")).to.equal(20);
        expect(await node.__get__("child3")).to.equal(30);
        
        var child4 = await node.__get__("child4");
        expect(child4).to.be.instanceof(context.Node);
        expect(child4.index).to.equal(4);
        
        expect(await node.__size__()).to.equal(4);
        expect(await child4.__size__()).to.equal(0);
        
        expect(await node.__text__()).to.equal(domNode.stringifyChildList());
        
        // self and complex expressions
        var domNode = dom.parse(stripIndent(`
            node1: self.child1 + self[2] + self[-1]
                child1: x * 1
                child2: x * self.index
                child3: x * self.y
                    y: root.node2
            node2: 3
            `));
        context.root = context.Node(domNode);
        expect(await context.root.__get__("node1")).to.equal( 10 + 20 + 30);
    });
    
    test("Context.prototype.size", async () => {
        var context = new Context();
        
        // size of an array
        var size = await context.size([1,2,3]);
        expect(size).to.equal(3);
        
        // size of a string
        var size = await context.size("abcdef");
        expect(size).to.equal(6);
        
        // size of an object
        var size = await context.size({a:1, b:2, c:3, d:4});
        expect(size).to.equal(4);
        
        // size of an object with __size__ method
        var obj = {__size__: async function () {return 30}}
        var size = await context.size(obj);
        expect(size).to.equal(30);
        
        // size of anything else
        var size = await context.size(25);
        expect(size).to.equal(0);
    });
    
    test("Context.prototype.Text", async () => {
        var context = new Context();
        
        // strings
        var text = await context.Text("abc");
        expect(text).to.equal("abc");

        // object with __text__ method
        var obj = {
            toString: () => "abc",
            __text__: async () => "def" 
        }
        var text = await context.Text(obj);
        expect(text).to.equal("def");
        
        // objects without __text__ method
        var obj = {
            toString: () => "abc",
        }
        var text = await context.Text(obj);
        expect(text).to.equal("abc");
    });
    
    test("Context.prototype.Template", async () => {
        var context = new Context();
        context.firstname = "Marcello";
        context.surname = "Del Buono";
        var text = await context.Template("My name is {{firstname + ' ' + surname}}!")
        expect(text).to.equal("My name is Marcello Del Buono!")
    });
    
    test("Context.prototype.Markdown", async () => {
        var context = new Context();
        var text = await context.Markdown("# Title")
        expect(text).to.equal(`<h1 id="title">Title</h1>\n`);        
    });
});
