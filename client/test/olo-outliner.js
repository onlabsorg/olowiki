
const Document = require("olojs/document");
const model = require("model");
const OloOutliner = require("olo-outliner");


const outlinerDoc = new Document();
outlinerDoc.set('data', {
    root: {
        __template__: "# root",
        child1: {
            __template__: "# child 1",
            grandChild1: {
                __template__: "# grand-child 1.1"
            },
            grandChild2: {
                __template__: "# grand-child 1.2"
            },
            grandChild3: {
                __template__: "# grand-child 1.3"
            },
        },
        child2: {
            __template__: "# child 2",
            grandChild1: {
                __template__: "# grand-child 2.1"
            },
            grandChild2: {
                __template__: "# grand-child 2.2"
            },
            grandChild3: {
                __template__: "# grand-child 2.3"
            },
        },
        child3: {
            __template__: "# child 3",
            grandChild1: {
                __template__: "# grand-child 3.1"
            },
            grandChild2: {
                __template__: "# grand-child 3.2"
            },
            grandChild3: {
                __template__: "# grand-child 3.3"
            },
        },
    }
});

model.setDocument(outlinerDoc);

const outliner = document.querySelector("olo-outliner");
outliner.addButton("save", () => {console.log("save button clicked")});
outliner.addButton("refresh", () => {console.log("refresh button clicked")});

outliner.addEventListener("keydown", event => {
    console.log("pressed:", event.keyString, "on", event.targetComponent);
});
