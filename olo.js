const portParamIndex = process.argv.indexOf("--port") + 1;
const port = portParamIndex ? process.argv[portParamIndex] : 8010;

const fs = require("fs");
const path = require("path");

const basePath = `${__dirname}/client`;
const dataPath = path.normalize(`${__dirname}/../.olo`);



// Initialize olojs Router

const Auth = require("./client/lib/olojs/auth");
const {FileStore, Router} = require("./client/lib/olojs/store-server");
const olojsStore = new FileStore(`${dataPath}/store`);
const routerOptions = JSON.parse(fs.readFileSync(`${dataPath}/config.json`));
const olojsRouter = new Router(olojsStore, routerOptions);



// Create express app

const express = require('express');
const app = express();

app.use("*", function (req, res, next) {
    req.userName = req.get('Authorization') || 'guest';
    next();
});

app.get("/", function (req, res, next) {
    const indexDoc = fs.readFileSync(`${basePath}/index.html`);
    res.set('Content-Type', "text/html");
    res.status(200).send(indexDoc);
});

app.get("/docs/*", function (req, res, next) {
    if (!req.xhr) {
        const indexDoc = fs.readFileSync(`${basePath}/index.html`);
        res.set('Content-Type', "text/html");
        res.status(200).send(indexDoc);
    }
    else {
        next();
    }
});

app.use('/docs', olojsRouter);

app.use(express.static(basePath, {etag:false}));



// Create and start http server

const http = require('http');
const server = http.createServer(app);

server.listen(port, function () {
    console.log(`Test HTTP server listening on port ${port}!`);
    console.log(`Root token: ${routerOptions.rootToken}`);
    console.log();
});
