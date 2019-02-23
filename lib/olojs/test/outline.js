const expect = require("chai").expect;
const stripIndent = require("strip-indent");
const Outline = require("../lib/outline");




suite("Outline", () => {
    
    test("constructor", async () => {
        
        var source = stripIndent(`
            value1
            key2: value2

                key3: value3

                key3: value4
                    value5

            key6: value6
            `);        
            
        var outline = new Outline(source);
        expect(outline.value).to.equal("");
        expect(outline.index).to.equal(0);
        expect(outline.name).to.equal("root");
        expect(outline.countChildren()).to.equal(3);
        expect(outline.getParent()).to.be.undefined;
        expect(outline.content).to.equal(source);
        
        const item1 = outline.getChild(0);
        expect(item1.value).to.equal("value1")
        expect(item1.index).to.equal(0);
        expect(item1.name).to.equal("");
        expect(item1.countChildren()).to.equal(0);
        expect(item1.getParent()).to.equal(outline);
        expect(item1.content).to.equal("");

        const item2 = outline.getChild(1);
        expect(item2.value).to.equal("value2")
        expect(item2.index).to.equal(1);
        expect(item2.name).to.equal("key2");
        expect(item2.countChildren()).to.equal(2);
        expect(item2.getParent()).to.equal(outline);
        expect(item2.content).to.equal("\nkey3: value3\n\nkey3: value4\n    value5\n");
        
        const item3 = item2.getChild(0);
        expect(item3.value).to.equal("value3")
        expect(item3.index).to.equal(0);
        expect(item3.name).to.equal("key3");
        expect(item3.countChildren()).to.equal(0);
        expect(item3.getParent()).to.equal(item2);
        expect(item3.content).to.equal("");
        
        const item4 = item2.getChild(1);
        expect(item4.value).to.equal("value4")
        expect(item4.index).to.equal(1);
        expect(item4.name).to.equal("key3");
        expect(item4.countChildren()).to.equal(1);
        expect(item4.getParent()).to.equal(item2);
        expect(item4.content).to.equal("value5\n");

        const item5 = item4.getChild(0);
        expect(item5.value).to.equal("value5")
        expect(item5.index).to.equal(0);
        expect(item5.name).to.equal("");
        expect(item5.countChildren()).to.equal(0);
        expect(item5.getParent()).to.equal(item4);
        expect(item5.content).to.equal("");

        const item6 = outline.getChild(2);
        expect(item6.value).to.equal("value6")
        expect(item6.index).to.equal(2);
        expect(item6.name).to.equal("key6");
        expect(item6.countChildren()).to.equal(0);
        expect(item6.getParent()).to.equal(outline);
        expect(item6.content).to.equal("");
        
        expect(outline.getChild(3)).to.be.undefined;
        expect(outline.getChild(-1)).to.equal(item6);
        expect(outline.getChild(-2)).to.equal(item2);
        expect(outline.getChild(-3)).to.equal(item1);
        expect(outline.getChild(-4)).to.be.undefined;
        
        expect(outline.getChild("key2")).to.equal(item2);
        expect(outline.getChild("key6")).to.equal(item6);
        expect(outline.getChild("key1")).to.be.undefined;
        expect(item2.getChild("key3")).to.equal(item4);
        
        source = stripIndent(`
            value1
            value2
                value3
                value4
              value5
            value6
            `);        
        try {
            var outline = new Outline(source);            
            throw new Error("It didn't throw");
        } catch (error) {
            expect(error.message).to.equal("Indentation error!");
        }
    });
    
    
    test("Outline.prototype.toString", () => {
        const source = stripIndent(`
            name1: value1
            name2: value2

                name3: value3

                name4: value4
                    name5: value5

            name6: value6
            `);        
        const outline = new Outline(source);
        expect(String(outline)).to.equal(source);
        
        const item2 = outline.getChild(1);
        expect(String(item2)).to.equal("name2: value2\n\n    name3: value3\n\n    name4: value4\n        name5: value5\n")
    });

    test("set node.value", () => {
        const source = stripIndent(`
            key: rootValue
                childValue1
                childValue2
            `);
        const outline = new Outline(source);
        const node = outline.getChild(0);
        node.value = " rootValue \n 1 ";
        expect(node.value).to.equal("rootValue \\n 1");
        expect(String(node)).to.equal("key: rootValue \\n 1\n    childValue1\n    childValue2\n")    
    });
    
    test("set node.name", () => {
        const source = stripIndent(`
            name: rootValue
                childValue1
                childValue2
            `);
        const outline = new Outline(source);
        const node = outline.getChild(0);
        node.name = "new_name";
        expect(String(node)).to.equal("new_name: rootValue\n    childValue1\n    childValue2\n");
        
        try {
            node.name = "non-valid name";
            throw new Error("It din't throw!");
        } catch (error) {
            expect(error.message).to.equal("Invalid node name!")
        }
    });
});
