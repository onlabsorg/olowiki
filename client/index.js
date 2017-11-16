
const YAML = require("js-yaml");
const model = require("model");

const OloComponent = require("olo-component");
const OloOutliner = require("olo-outliner");
const FontAwesome = require("lib/themes/font-awesome");


async function loadDocument (path) {

    const response = await fetch(path, {
        method: "GET",
        headers: new Headers({
            'authorization': "let-me-in",
            'X-Requested-With': "XMLHttpRequest"
        }),
    });

    switch (response.status) {

        case 200:
            var docAuth = response.headers.has('olo-Doc-Auth') ? response.headers.get('olo-Doc-Auth') : "read";
            var docContent = await response.text();
            break;

        default:
            let errorMessage = await response.text();
            throw new Error(errorMessage);
    }

    const docHash = YAML.load(docContent);
    const doc = await model.memory.createDocument(docHash);
    doc.readonly = (docAuth === "read");

    return doc;
}


async function start () {
    const outliner = document.querySelector("olo-outliner");

    const doc1 = await loadDocument("/olo/test-doc1.yaml");
    outliner.addDocument(doc1);

    const doc2 = await loadDocument("/olo/test-doc2.yaml");
    outliner.addDocument(doc2);
}


start();
