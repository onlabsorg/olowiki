const pathlib = require('path');
const fs = require('fs');
const http = require('http');
const express = require('express');
const olojs = require('@onlabsorg/olojs');

const ROOT_PATH = pathlib.join(__dirname, "../dist");
const HOME_PAGE = fs.readFileSync(pathlib.join(ROOT_PATH, "client.html"), "utf8");


module.exports = function (store) {
    const app = express();    
    
    app.use('/store',
            olojs.HTTPServer.StoreMiddleware(store) );
            
    app.get('/', 
            (req, res, next) => res.status(200).send(HOME_PAGE) );
            
    app.use('/', 
            express.static(ROOT_PATH) );
            
    return http.createServer(app);
}
