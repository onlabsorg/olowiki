const stripIndent = require("strip-indent");

const olojs = require("olojs");
const hub = new olojs.Hub();

module.exports = hub.create("http://test-store/test-document", stripIndent(`
    instructions: Markdown(self)
        # Instructions
        Click the buttons above to test the viewer functionalities.
        
    template: Markdown(Template(self))
        # Template
        This is arendered template.  
        The following list shows some variables and the expected values between
        brackets:
        * **root.data.x:** _{{root.data.x}}_ [10]
        * **object.y:** _{{object.y}}_ [20]
        * **root.structure.z:** _{{root.structure.z}}_ [30]
        * **import("document2#val1"):** _{{import("document2#val1")}}_ [abc]
        
    structure: object

    node:
        child1: 10
        child2: 20
        child3: root.node.child1 + root.node.child2
        child4: 
            child41: "abc"
            child42: "def"
            child43: "ghi"
        
    data:
        x: 10
        mybdate: Date("1977-02-26")
        n: null
        b: true
        dict: object
        list: object.a

`));
