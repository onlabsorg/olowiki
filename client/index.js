
const model = require("model");
const {HTTPStore, Client} = require("olojs/store-client");

const OloComponent = require("olo-component");
const OloOutliner = require("olo-outliner");
const FontAwesome = require("lib/themes/font-awesome");

const outliner = document.querySelector("olo-outliner");

function applyHash () {
    const path = location.hash ? location.hash.substr(1) : "/";
    outliner.tree.selectedPath = path;
}

window.addEventListener('hashchange', applyHash);

outliner.addEventListener("olo-tree-node-selected", (event) => {
    const path = event.detail.path;
    location.hash = `#${path}`;
});



const store = new HTTPStore();
const client = new Client(store, "Owner");

async function start () {
    const outliner = document.querySelector("olo-outliner");
    const docPath = location.pathname === "/" ? "/docs/home.yaml" : location.pathname;
    const doc = await client.loadDocument(docPath);
    model.setDocument(doc);
    applyHash();
}

start();
