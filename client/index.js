
const store = require("store");

const OloComponent = require("olo-component");
const OloOutliner = require("olo-outliner");
const FontAwesome = require("lib/themes/font-awesome");


async function start () {
    const outliner = document.querySelector("olo-outliner");

    const doc1 = await store.Document.load("/olo/test-doc1.yaml");
    outliner.addDocument(doc1);

    const doc2 = await store.Document.load("/olo/test-doc2.yaml");
    outliner.addDocument(doc2);
}


start();
