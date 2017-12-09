
const Document = require("olojs/document");
const model = require("model");
const OloTree = require("olo-tree");


const treeDoc = new Document();
treeDoc.set('data', {
    root: {
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
        },
    }
});

model.setDocument(treeDoc);
