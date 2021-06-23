const olojs = require('@onlabsorg/olojs');
const plugin = require('..').stilo;

const store = new olojs.FileStore(`${__dirname}/stilo-home`);

plugin.commands.wiki(store)
        .then(() => {
            console.log('@test/stilo-plugin: stilo command successfully executed');
        })
        .catch(error => {
            console.log('@test/stilo-plugin: stilo command failed');
            throw error;
        });