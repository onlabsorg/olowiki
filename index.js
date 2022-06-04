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

    async wiki (store, options={}) {
        const server = Server(store);
        const port = options.port || 8010;
        server.listen(port, err => {
            if (err) throw err;
            console.log(`oloWiki server listening on port ${port}`);
        });
    }
}
