/**
 *  olo v0.2.x
 *  
 *  Copyright 2018 Marcello Del Buono (m.delbuono@gmail.com)
 *
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy 
 *  of this software and associated documentation files (the "Software"), to 
 *  deal in the Software without restriction, including without limitation the 
 *  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
 *  sell copies of the Software, and to permit persons to whom the Software is 
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in 
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
 *  THE SOFTWARE.
 *  
 */



// prepare the tools
const logger = require("./lib/server/logger");
logger.level ="debug";  // Options: 'error', 'warn', 'info', 'verbose', 'debug', 'silly'

const path = require("path");
const fs = require("fs");
const rootPath = __dirname;



// load the json object contained in package.json
const packageInfoFilePath = path.resolve(rootPath, "package.json");
const packageInfo = JSON.parse(fs.readFileSync(packageInfoFilePath, {encoding:'utf8'}));
logger.info(`Starting up olo v.${packageInfo.version}`);

// load the instance-specific configuration file
const configFilePath = path.resolve(rootPath, process.argv[2]);
const config = JSON.parse(fs.readFileSync(configFilePath, {encoding:'utf8'}));





// Create the express server: ...
const express = require("express");
const app = express();


// ... address webpack code chunks requests;
app.get('*/:fname(*\.bundle\.js)', (req, res, next) => {
    fs.readFile(`${__dirname}/dist/${req.params.fname}`, {encoding:'utf8'}, (err, chunk) => {
        if (err) res.status(500).send(err);
        else res.status(200).send(chunk);
    });                
});


// ... address info requests;
app.get('/info', (req, res, next) => {
    res.status(200).json({
        version: packageInfo.version
    });
});


// ... load authentication services;
const GoogleAuth = require("./lib/server/google-auth");
app.use( GoogleAuth(config.auth.googleClientSecret, config.auth.jwtKey) );


// ... load olo store document server;
const storePath = path.resolve(path.dirname(configFilePath), config.store.path);
const storeRoute = "/docs";
const StoreServer = require("./lib/server/fs-store-server");
app.use( new StoreServer(storePath, storeRoute) );


// ... handles root request;
app.get('/', (req, res, next) => {
    res.redirect(`/docs/home`);
});


// ... address olo document html requests;
const clientTemplate = fs.readFileSync(`${__dirname}/lib/client.html`, {encoding:'utf8'});
app.get(`${storeRoute}/:docURL(*)`, (req, res, next) => {
    const html = clientTemplate.replace("{{docURL}}", req.path);
    res.status(200).send(html);
});


// ... serve static files;
app.use(express.static(rootPath));


// ... start listening for HTTP requests.
const port = config.http.port;
app.listen(port, () => {
    logger.info(`olo server listening on port ${port}`);
});
