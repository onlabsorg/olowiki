
const stripIndent = require("strip-indent");

const Store = require("../lib/memory-store");
const store = new Store();

const testInfo = {

    rwdoc_URL: "/path/to/rw-doc",
    rwdoc_Source: stripIndent(`
        name1: value1
        name2: value2
            name3: value3
            name4: value4
                name5: value5
        name6: value6
        `),
        
    nodoc_URL: "/path/to/non-existing-doc",
        
    rodoc_URL: false,     // the store doesn't support read-only documents
    privatedoc_URL: false,      // the store doesn't support private documents
};

store._map.set(testInfo.rwdoc_URL, testInfo.rwdoc_Source);

const describeStore = require("./store");
describeStore("MemoryStore", store, testInfo);
