const LocalStore = require("../lib/local-store");

async function Store (content) {
    const store = new LocalStore("test");
    for (let path in content) {
        await store._writeDocument(path, content[path]);
    }
    return store;
}


const test = require("olojs/test/store");
test("LocalStore", Store);
