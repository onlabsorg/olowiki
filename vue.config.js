const olo = require('@onlabsorg/olojs');

module.exports = {
    
    pages: {
        index: {
            entry: 'src/main.js',
            template: 'public/index.html',
            filename: 'index.html',
            title: 'oloWiki',
        },
    },
    
    transpileDependencies: [
        'vuetify'
    ],
    
    devServer: {
        
        before (app) {
            const express = require('express');
            const homeStore = new olo.FileStore(`${__dirname}/test/home`);
            app.use('/home', olo.HTTPServer.createMiddleware(homeStore));
            app.use('/help', express.static(`${__dirname}/docs/help`));
        }
    }
}
