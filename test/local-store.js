const PouchdbBackend = require("../lib/pouchdb-backend");
const olojs = require("olojs");

async function createStore (content) {
    var backend = new PouchdbBackend("test");
    var store = new olojs.Store("//local-store/", backend);
    await store.delete("/");
    for (let path in content) {
        await store._put(path, content[path]);
    }
    return store;
}


const test = require("olojs/test/store");

describe("PouchdbStore", () => {
    test(createStore);    
});
