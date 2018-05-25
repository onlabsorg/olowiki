
const path = require("path");
const fs = require("fs");

const port = 8010;
const rootPath = __dirname;
const dataPath = path.join(rootPath, "..", ".olo");
const storePath = path.join(dataPath, "/store");

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



// add olo services
const OloServer = require("./src/server");
const Store = require("./src/server/fs-store");
const jwtKey = require(dataPath+"/jwt-key");
const store = new Store(storePath, {jwtKey});
app.use( OloServer(store, "/store") );



// add authentication services
const GoogleAuth = require("./src/server/google-auth");
const googleClientSecret = JSON.parse(fs.readFileSync(`${dataPath}/google_client_secret.json`, {encoding:'utf8'}));
app.use( GoogleAuth(store, googleClientSecret) );





// serve static files
app.use(express.static(rootPath));



// start listening for HTTP requests
app.listen(port, () => {
    console.log(`olo server listening on port ${port} ...`);
});
