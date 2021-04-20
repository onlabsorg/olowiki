const olowiki = module.exports = {};

const olojs = require('@onlabsorg/olojs');
const pathlib = require("path");

const express = require('express');
const http = require('http');


olowiki.WikiMiddleware = function (store) {
    const router = express.Router();
    const publicPath = pathlib.join(__dirname, "./public");
    
    router.use('/docs', olojs.HTTPServer.StoreMiddleware(store));
        
    router.use( express.static(publicPath) );

    return router;    
}

olowiki.createServer = function (store) {
    const app = express();    
    app.use('/', olowiki.WikiMiddleware(store));
    return http.createServer(app);
}


olowiki.middlewares = {
    '/wiki': olowiki.WikiMiddleware
}
