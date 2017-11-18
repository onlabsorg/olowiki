
const store = require("store");

const OloComponent = require("olo-component");
const OloOutliner = require("olo-outliner");
const FontAwesome = require("lib/themes/font-awesome");

const outliner = document.querySelector("olo-outliner");

function applyHash () {
    const path = location.hash ? location.hash.substr(1) : "/";
    const targetNode = outliner.tree.findNodeByPath(path) || outliner.tree;
    targetNode.select();
}

window.addEventListener('hashchange', applyHash);

outliner.addEventListener("olo-node-selected", (event) => {
    const path = event.detail.oloNode.model.path;
    location.hash = `#${path}`;
});

async function start () {
    const outliner = document.querySelector("olo-outliner");
    const docPath = location.pathname === "/" ? "/docs/home.yaml" : location.pathname;
    outliner.document = await store.Document.load(docPath);
    applyHash();
}

start();
