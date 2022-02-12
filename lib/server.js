const pathlib = require('path');
const fs = require('fs');
const http = require('http');
const express = require('express');
const olo = require('@onlabsorg/olojs');

module.exports = function (rootStore) {
    const app = express();    
    
    app.all("*", (req, res, next) => {
        console.log(req.method, req.path);
        next();
    });
    
    app.use('/docs',
            olo.HTTPServer.createMiddleware(rootStore) );

    app.use('/about',
            express.static(pathlib.join(__dirname, "../dist/about")) );
            
    app.use('/', 
            express.static(pathlib.join(__dirname, "../dist")) );
            
    return http.createServer(app);
}
