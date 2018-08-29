

const Document = require("../lib/olojs/document");

const Store = require("../lib/olojs/stores/fs-store");
const store = new Store(`${__dirname}/store`);

const Server = require("../lib/olojs/stores/http-store-server");

const auth = {
    read: (doc, user) => doc.get("public") || user.id === doc.get("author"),
    write: (doc, user) => doc !== null && user && user.id === doc.get('author'),
    create: (path, user) => user && user.id && user.id !== "undefined" && user.id !== "null",    
}
const server = new Server(store, "/docs", auth);

const express = require("express");
const app = express();

app.all(`*`, (req, res, next) => {
    req.oloUser = {id: req.get('Authorization')};
    next();        
});

app.use(server);

app.listen(8888, () => {
    console.log(`http-store-server listening on port 8888 ...`);
});
