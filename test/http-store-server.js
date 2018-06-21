

const Document = require("../lib/olojs/document");

const Store = require("../lib/olojs/stores/fs-store");
const store = new Store(`${__dirname}/store`);

const Server = require("../lib/olojs/stores/http-store-server");
const server = new Server(store, "/docs");

const express = require("express");
const app = express();

app.all(`*`, (req, res, next) => {
    req.userId = req.get('Authorization').substr(7);
    next();        
});

app.use(server);

app.listen(8888, () => {
    console.log(`http-store-server listening on port 8888 ...`);
});
