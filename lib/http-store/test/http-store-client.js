// Run test:
// $ node test/http-store-server
// $ mocha test/http-store-client

require("isomorphic-fetch")
const fs = require("fs");

const HTTPStoreClient = require("../lib/http-store-client");
const client = new HTTPStoreClient("http://localhost:8888/store", "... auth header here ...")

const storeInfo = {
    rwdoc_URL: "/writable-doc",
    rwdoc_Source: "key1: value1\nkey2: value2\nkey3: value3\n",
    
    nodoc_URL: "/non-existing-doc",
        
    rodoc_URL: false,     // the store doesn't support read-only documents
    privatedoc_URL: false,      // the store doesn't support private documents    
}

const storePath = `${__dirname}/store/http-store-test`;
fs.writeFileSync(`${storePath}${storeInfo.rwdoc_URL}.olo`, storeInfo.rwdoc_Source, "utf8")
if (fs.existsSync(`${storePath}${storeInfo.nodoc_URL}.olo`)) {
    fs.unlinkSync(`${storePath}${storeInfo.nodoc_URL}.olo`);
}

const describeStore = require("olojs/test/store");
describeStore("HTTPStoreClient", client, storeInfo);
