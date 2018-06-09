
const path = require("path");
const fs = require("fs");

const rootPath = __dirname;

const configFilePath = path.resolve(rootPath, process.argv[2]);
const config = JSON.parse(fs.readFileSync(configFilePath, {encoding:'utf8'}));

const express = require("express");
const app = express();



// addresses webpack code chunks requests
app.get('*/:fname(*\.bundle\.js)', (req, res, next) => {
    fs.readFile(`${__dirname}/dist/${req.params.fname}`, {encoding:'utf8'}, (err, chunk) => {
        if (err) res.status(500).send(err);
        else res.status(200).send(chunk);
    });                
});



// add authentication services
const GoogleAuth = require("./lib/server/google-auth");
app.use( GoogleAuth(config.auth.googleClientSecret, config.auth.jwtKey) );



// olo store document server
const storePath = path.resolve(path.dirname(configFilePath), config.store.path);
const storeRoute = "/docs";
const StoreServer = require("./lib/server/fs-store-server");
app.use( new StoreServer(storePath, storeRoute) );



// handles root request
app.get('/', (req, res, next) => {
    res.redirect(`/docs/home.html`);
});



// serve static files
app.use(express.static(rootPath));



// start listening for HTTP requests
const port = config.http.port;
app.listen(port, () => {
    console.log(`olo server listening on port ${port} ...`);
});
