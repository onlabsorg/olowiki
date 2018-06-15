
const HTTPStoreServer = require("../olojs/stores/http-store-server");

module.exports = function (storePath, storeRoute, jwtKey) {
    const Backend = require("../olojs/stores/fs-store");
    const backend = new Backend(storePath);
    return new HTTPStoreServer(backend, storeRoute, jwtKey);
}