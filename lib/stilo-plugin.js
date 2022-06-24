const pathlib = require('path');
const olo = require('@onlabsorg/olojs');
const Server = require('./server');

module.exports = {
    
    routes: {
    
        '/.wiki/': new olo.FileStore(`${__dirname}/../dist/.wiki/`)
    },

    commands: {
        
        async wiki (store, options, path='/') {
            /// starts an olowiki HTTP server
            
            // Print the help message if -h or --help option is passed
            if (options.h || options.help) {
                console.log('stilo-run wiki [options] [path]                                        ');
                console.log('                                                                       ');
                console.log('Starts an olowiki HTTP server.                                         ');
                console.log('                                                                       ');
                console.log('Arguments:                                                             ');
                console.log('  path          path of the directory to be served as store root       ');
                console.log('                                                                       ');
                console.log('Options:                                                               ');
                console.log('  -p, --port    port on which the server will listen (defaults to 8010)');
                console.log('  -h, --help    show this message                                      ');
                return;
            }
            
            // Determine the path to be served as server root
            const serverRootPath = resolvePath(store.stiloRootPath, path);
            if (serverRootPath !== '/') store = store.subStore(serverRootPath);

            // Create and start the server
            const server = Server(store);
            const port = options.port || options.p || 8010;
            server.listen(port, err => {
                if (err) throw err;
                console.log(`olowiki: serving '${serverRootPath}' on port ${port}`);
            });
        }
    }
}


function resolvePath (storeRootPath, path) {
    const fullPath = pathlib.join(process.cwd(), path);
    const relativePath = pathlib.relative(storeRootPath, fullPath);
    if (relativePath.slice(0,2) === './' || relativePath.slice(0,3) === '../') {
        return '/'
    } else {
        return pathlib.normalize(`/${relativePath}`);
    }
    
}
