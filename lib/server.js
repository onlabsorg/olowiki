/**
 *  olowiki v0.3.x
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
const logger = require("./server/logger");
logger.level ="debug";  // Options: 'error', 'warn', 'info', 'verbose', 'debug', 'silly'

const Path = require("path");
const fs = require("fs");
const rootPath = Path.resolve(__dirname, "..");


const express = require("express");
const GoogleAuth = require("./server/google-auth");
const HTTPStoreServer = require("./olojs/stores/http-store-server");
const Backend = require("./olojs/stores/fs-store");
const clientHTMLPage = fs.readFileSync(`${rootPath}/lib/client.html`, {encoding:'utf8'});

const authorizationStrategies = {
    Default: (options) => Object({
        read: (doc, user) => doc.get("public") || user.id === doc.get("author"),
        write: (doc, user) => doc !== null && user && user.id === doc.get('author'),
        create: (path, user) => user && user.id && user.id !== "undefined" && user.id !== "null",        
    }),
    SingleOwner: (options) => Object({
        read: (doc, user) => doc.get("public") || user.id === options.owner,
        write: (doc, user) => doc !== null && user && user.id === options.owner,
        create: (path, user) => user && user.id === options.owner,        
    })
}



function Server (configFilePath) {

    // load the json object contained in package.json
    const packageInfoFilePath = Path.resolve(rootPath, "package.json");
    const packageInfo = JSON.parse(fs.readFileSync(packageInfoFilePath, {encoding:'utf8'}));
    logger.info(`Starting up olo v.${packageInfo.version}`);


    // load the instance-specific configuration file
    const config = JSON.parse(fs.readFileSync(configFilePath, {encoding:'utf8'}));


    // Create the express server: ...
    const server = express();


    // ... log the requests
    server.all('*', (req, res, next) => {
        logger.debug(`${req.method} ${req.path}`);
        next();
    });


    // ... address webpack code chunks requests;
    server.get('*/:fname(*\.bundle\.js)', (req, res, next) => {
        fs.readFile(`${rootPath}/dist/${req.params.fname}`, {encoding:'utf8'}, (err, chunk) => {
            if (err) res.status(500).send(err);
            else res.status(200).send(chunk);
        });                
    });


    // ... address info requests;
    server.get('/info', (req, res, next) => {
        res.status(200).json({
            version: packageInfo.version
        });
    });


    // ... load authentication services;
    server.use( GoogleAuth(config.auth.googleClientSecret, config.auth.jwtKey) );
    
    // ... creates a store user instance from the google user information
    server.all( "*", (req, res, next) => {
        req.userId = req.user.email;
        req.oloUser = {
            id: req.user.email
        };
        next();
    });

    
    // ... handles user info requests
    server.get('/user', (req, res, next) => {
        const user = {
            id: req.oloUser.id
        };
        res.status(200).json(user);
    });
    
    
    // ... load store document servers
    for (let storeConfig of config.stores) {
        const path = Path.join(configFilePath, "..", storeConfig.path);
        const backend = new Backend(path);
        const Auth = authorizationStrategies[storeConfig.auth];
        const auth = Auth(storeConfig.authOptions);
        const route = "/" + storeConfig.name;
        
        server.use( new HTTPStoreServer(backend, route, auth) );
        server.get(`${route}/:docURL(*)`, (req, res, next) => {
            res.status(200).send(clientHTMLPage);
        });
    }
    

    // ... handles root request;
    server.get('/', (req, res, next) => {
        res.redirect(config.homePath);
    });


    // ... serve static files;
    server.use(express.static(rootPath));    
    
    return server;
}


module.exports = Server;
