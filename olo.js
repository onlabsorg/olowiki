
const path = require("path");
const fs = require("fs");

const rootPath = __dirname;

const configFilePath = path.resolve(rootPath, process.argv[2]);
const config = JSON.parse(fs.readFileSync(configFilePath, {encoding:'utf8'}));

const express = require("express");
const app = express();


// parse the json request body
const bodyParser = require("body-parser");
app.use(bodyParser.json());


// addresses code chunks requests
app.get('*/:fname(*\.bundle\.js)', (req, res, next) => {
    fs.readFile(`${__dirname}/dist/${req.params.fname}`, {encoding:'utf8'}, (err, chunk) => {
        if (err) res.status(500).send(err);
        else res.status(200).send(chunk);
    });                
});


// olo store document server
const storePath = path.resolve(path.dirname(configFilePath), config.store.path);
const StoreServer = require("./src/server").HTTPFileStoreServer;
app.use( new StoreServer(storePath, '/store', config.auth.jwtKey) );


// handles user info requests
app.get('/user', (req, res, next) => {
    res.status(200).json(req.olo.user);
});


// add authentication services
const GoogleAuth = require("./src/server/google-auth");
const googleClientSecret = {web: config.auth.google};
app.use( GoogleAuth(googleClientSecret, config.auth.jwtKey) );


// serve static files
app.use(express.static(rootPath));


// start listening for HTTP requests
const port = config.http.port;
app.listen(port, () => {
    console.log(`olo server listening on port ${port} ...`);
});
