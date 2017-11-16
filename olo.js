const portParamIndex = process.argv.indexOf("--port") + 1;
const port = portParamIndex ? process.argv[portParamIndex] : 8010;

const fs = require("fs");

const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const Store = require('./server/store');
const store  = new Store(`${__dirname}/server/store`);

const basePath = `${__dirname}/client`;

app.get("/", function (req, res, next) {
    const indexDoc = fs.readFileSync(`${basePath}/index.html`);
    res.set('Content-Type', "text/html");
    res.status(200).send(indexDoc);
});

const Router = require("./server/router");
app.use("/olo", Router(store));

app.use(express.static(basePath, {etag:false}));

server.listen(port, function () {
    console.log(`Test HTTP server listening on port ${port}!`);
    console.log();
});
