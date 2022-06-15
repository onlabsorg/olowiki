const express = require('express');
const olo = require('@onlabsorg/olojs');



// olowiki HTTP Server
const Server = exports.Server = require('./lib/server');



// STILO PLUGIN
exports.stilo = {

    async __init__ (store) {
        store.mount('/.wiki/', new olo.FileStore(`${__dirname}/dist/.wiki/`));
        return store;
    },

    wiki: {
        
        description: "Starts an olowiki HTTP server",
        
        arguments: [
            "[path] ? root path to be served [defaults to '/']"
        ],
        
        options: [
            "-p, --port <port> ? server port [defaults to 8010]"
        ],
        
        async action (path, options) {
            const store = path ? this.subStore(path) : this;
            const server = Server(store);
            const port = options.port || 8010;
            server.listen(port, err => {
                if (err) throw err;
                console.log(`oloWiki server listening on port ${port}`);
            });
        }
    }
}
