const LocalStore = require("../lib/pouchdb-store");

async function Store (content) {
    console.log(1);
    var store = new LocalStore("test");
    console.log(2);
    const docPaths = await store._list();
    console.log(3);
    for (let docPath of docPaths) {
        await store._deleteDocument(docPath);
    }
    console.log(4);
    for (let path in content) {
        console.log(4, path);
        await store._writeDocument(path, content[path]);
    }
    console.log(5);
    return store;
}


const test = require("olojs/test/store");
test("LocalStore", Store);
