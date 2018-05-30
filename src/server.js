
const HTTPStoreServer = require("./olo/stores/http-store-server");

exports.HTTPFileStoreServer = function (storePath, storeRoute, jwtKey) {
    const Backend = require("./olo/stores/fs-store");
    const backend = new Backend(storePath);
    return new HTTPStoreServer(backend, storeRoute, jwtKey);
}
