
const fs = require("fs");

const Store = require("../lib/fs-backend");
const storePath = `${__dirname}/store/fs-backend-test`;
const backend = new Store(storePath, ".olo");

const storeInfo = {
    rwdoc_URL: "/writable-doc",
    rwdoc_Source: "key1: value1\nkey2: value2\nkey3: value3\n",
    
    nodoc_URL: "/non-existing-doc",
        
    rodoc_URL: false,     // the store doesn't support read-only documents
    privatedoc_URL: false,      // the store doesn't support private documents    
}

fs.writeFileSync(`${storePath}${storeInfo.rwdoc_URL}.olo`, storeInfo.rwdoc_Source, "utf8")
if (fs.existsSync(`${storePath}${storeInfo.nodoc_URL}.olo`)) {
    fs.unlinkSync(`${storePath}${storeInfo.nodoc_URL}.olo`);
}

const describeStore = require("olojs/test/store");
describeStore("FSBackend", backend, storeInfo);
