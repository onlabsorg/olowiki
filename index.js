
// olowiki HTTP Server
exports.createServer = require('./lib/server');



// STILO PLUGIN
exports.stilo = {
    
    routes: {},
    
    protocols: {},
    
    commands: {
        'wiki': async (store, options={}) => {
            const server = exports.createServer(store);
            const port = options.port || 8010;
            await new Promise((resolve, reject) => server.listen(port, 
                        err => err ? reject(err) : resolve() ));
            console.log(`olowiki HTTP server listening on port ${port}`);        
        }
    }
}
