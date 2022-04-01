
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
            const olo = require('@onlabsorg/olojs');
            const express = require('express');
            const rootStore = new olo.FileStore(`${__dirname}/test/root-store`);
            app.use('/docs', olo.HTTPServer.createMiddleware(rootStore));
            app.use('/about', express.static(`${__dirname}/dist/about`));
        }
    }
}
