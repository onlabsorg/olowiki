const express = require('express');
const olo = require('@onlabsorg/olojs');



// olowiki HTTP Server
const Server = exports.Server = require('./lib/server');



// STILO PLUGIN
exports.stilo = {
    
    routes: {},
    
    commands: {
        
        "wiki": async (store, options={}) => {
            const server = Server(store.homeStore);
            const port = options.port || 8010;
            server.listen(port, err => {
                if (err) throw err;
                console.log(`oloWiki server listening on port ${port}`);
            });
        }
    }
}
