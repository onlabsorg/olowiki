
const Path = require("olojs/path");
const Model = require("model");
const {Store, RemoteDocument} = require("olojs/store-client");

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



async function loadDocument () {
    const urlPath = Path.parse(location.pathname === "/" ? "/docs/home.yaml" : location.pathname);
    const storePath = Path.parse(urlPath[0]);
    const docPath = Path.parse(urlPath.slice(1));
    const store = new Store(`${location.origin}${storePath}`);
    const query = new URLSearchParams(document.location.search.substring(1));
    const authToken = query.get("auth");
    const doc = await RemoteDocument(store, String(docPath), authToken);
    return doc;
}

loadDocument()
.then(doc => {
    outliner.parentModel = new Model(doc, "/");
    applyHash();
})
.catch (error => {throw error});
