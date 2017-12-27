
const Document = require("olojs/document");
const Model = require("model");
const OloTree = require("olo-tree");


const treeDoc = new Document({
    committed: {
        child1: {
            grandChild1: {},
            grandChild2: {},
            grandChild3: {},
        },
        child2: {
            grandChild1: {},
            grandChild2: {},
            grandChild3: {},
        },
        child3: {
            grandChild1: {},
            grandChild2: {},
            grandChild3: {},
        }
    }
});

treeDoc.name = "test-doc";

const treeElt = document.querySelector("olo-tree");
treeElt.parentModel = new Model(treeDoc, "/")

treeElt.addEventListener("olo-tree-item-click", (event) => {
    console.log(`Clicked item: ${event.detail.path}`);
});
