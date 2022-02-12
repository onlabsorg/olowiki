const express = require('express');
const olo = require('@onlabsorg/olojs');



// olowiki HTTP Server
const Server = exports.Server = require('./lib/server');



// STILO PLUGIN
exports.stilo = {
    
    async __init__ (store) {
        const configDocPath = "/.wiki/config";
        if (await store.read(configDocPath) == "") {
            const fs = require('fs');
            const configDocSource = fs.readFileSync(`${__dirname}/template.wiki/config.olo`, "utf8");
            await store.write(configDocPath, configDocSource);
        }
        store.mount('/.wiki/help/', new olo.FileStore(`${__dirname}/template.wiki/help/`));
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
