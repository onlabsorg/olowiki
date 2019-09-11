
const MemoryStore = require("../lib/memory-store");

async function Store (content) {
    const store = new MemoryStore();
    for (let path in content) {
        store._docs.set(path, content[path]);
    }
    return store;
}


const test = require("./store");
test("MemoryStore", Store);
