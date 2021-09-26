const olo = require('@onlabsorg/olojs');
const plugin = require('..').stilo;

const homeStore = new olo.FileStore(`${__dirname}/home`);
const hub = new olo.Hub(homeStore);

plugin.commands.wiki(hub)
        .then(() => {
            console.log('@test/stilo-plugin: stilo command successfully executed');
        })
        .catch(error => {
            console.log('@test/stilo-plugin: stilo command failed');
            throw error;
        });