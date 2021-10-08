const pathlib = require('path');
const fs = require('fs');
const http = require('http');
const express = require('express');
const olo = require('@onlabsorg/olojs');

module.exports = function (homeStore) {
    const app = express();    
    
    app.all("*", (req, res, next) => {
        console.log(req.method, req.path);
        next();
    });
    
    app.use('/home',
            olo.HTTPServer.createMiddleware(homeStore) );

    app.use('/help',
            express.static(pathlib.join(__dirname, "../docs/help")) );
            
    app.use('/', 
            express.static(pathlib.join(__dirname, "../dist")) );
            
    return http.createServer(app);
}
