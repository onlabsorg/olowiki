const portParamIndex = process.argv.indexOf("--port") + 1;
const port = portParamIndex ? process.argv[portParamIndex] : 8010;

const fs = require("fs");

const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);


app.use("*", function (req, res, next) {
    req.userName = req.get('Authorization') || 'guest';
    next();
});


const basePath = `${__dirname}/client`;

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



const {FileStore, Router} = require("./client/lib/olojs/store-server");
const olojsStore = new FileStore(`${__dirname}/server/store`);
const olojsRouter = new Router(olojsStore);

app.use('/docs', olojsRouter);



app.use(express.static(basePath, {etag:false}));

server.listen(port, function () {
    console.log(`Test HTTP server listening on port ${port}!`);
    console.log();
});
