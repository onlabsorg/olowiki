const portParamIndex = process.argv.indexOf("--port") + 1;
const port = portParamIndex ? process.argv[portParamIndex] : 8010;

const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const basePath = `${__dirname}/..`;



app.use("*", function (req, res, next) {
    req.userName = req.get('Authorization') || 'guest';
    next();
});


const bodyParser = require('body-parser');
const fs = require('fs');

app.use(bodyParser.text());

app.put("/fs/*", function (req, res, next) {
    fs.writeFileSync(`${__dirname}/olojs/store/${req.path.substr(4)}`, req.body, {encoding:'utf8'});
    res.status(200).send();
});

app.delete("/fs/*", function (req, res, next) {
    fs.unlinkSync(`${__dirname}/olojs/store/${req.path.substr(4)}`);
    res.status(200).send();
});



const {FileStore, Router} = require("../lib/olojs/store-server");
const olojsStore = new FileStore(`${__dirname}/olojs/store`);
const olojsRouter = new Router(olojsStore);

app.use('/store', olojsRouter);



app.use(express.static(basePath, {etag:false}));

server.listen(port, function () {
    console.log(`olojs test web server listening on port ${port}!`);
});
