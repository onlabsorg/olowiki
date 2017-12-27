
const Document = require("olojs/document");
const Model = require("model");
const OloOutliner = require("olo-outliner");


const outlinerDoc = window.outlinerDoc = new Document({
    committed: {
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
                __template__: "# child 2.1"
            },
            grandChild2: {
                __template__: "# child 2.2",
            },
            grandChild3: {
                __template__: "# child 2.3",
                grandGrandChild1: {__template__: "# child 2.3.1"},
                grandGrandChild2: {__template__: "# child 2.3.2"},
                grandGrandChild3: {__template__: "# child 2.3.3"},
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
        }
    }
});

outlinerDoc.name = "test-doc";

const outliner = document.querySelector("olo-outliner");
outliner.parentModel = new Model(outlinerDoc, "/");
