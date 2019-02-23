// Start server:
// $ node test/http-store-server

const express = require("express");
const app = express();

const stripIndent = require("strip-indent");

const Backend = require("../lib/fs-backend");
const storePath = `${__dirname}/store/http-store-test`;
const backend = new Backend(storePath);

const auth = require("../lib/auth");
const storeAuth = new auth.PublicAuth();

const HTTPStoreServer = require("../lib/http-store-server");
app.use('/store', HTTPStoreServer(backend, storeAuth));

app.listen(8888, () => {
    console.log(`http-store-server listening on port 8888 ...`);
});    
