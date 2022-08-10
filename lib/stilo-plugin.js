const pathlib = require('path');
const fs = require('fs');
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
        },

        "wiki-build": async function (store, options, path='.') {
            /// builds a static olo-wiki single-page application
            
            // Print the help message if -h or --help option is passed
            if (options.h || options.help) {
                console.log("stilo-run wiki-build [options] [path]                                                  ");
                console.log("                                                                                       ");
                console.log("Builds a static olo-wiki SPA in a given root directory.                                ");
                console.log("                                                                                       ");
                console.log("Arguments:                                                                             ");
                console.log("  path                     path of the root directory to be served (defaults to '.')   ");
                console.log("                                                                                       ");
                console.log("Options:                                                                               ");
                console.log("  -t, --title <title>      define the title of the static application                  ");
                console.log("  -h, --help               show this message                                           ");
                console.log("                                                                                       ");
                return;
            }
            
            // Determine the root path of the single-page application
            const rootPath = pathlib.resolve(path);

            // Copy the application files to the root directory
            console.log(`Installing olowiki static app in '${rootPath}' ...`);
            await renderTemplate('index.olo', rootPath, 'index.html', {
                title: options.title || options.t || "oloWiki"
            });
            await copyFile('favicon.ico', rootPath);
            await copyDirectory('.wiki', rootPath);
            console.log('Done!\n');
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

const copyFile = (srcName, destRoot, destName="") => new Promise((resolve, reject) => {
    const [src, dest] = resolvePaths(srcName, destRoot, destName);
    console.log(`... copying '${src}' -> '${dest}'`);
    fs.copyFile(src, dest, err => {
            if (err) reject(err);
            else resolve();
        });
});

const copyDirectory = (srcName, destRoot, destName="") => new Promise((resolve, reject) => {
    const ncp = require('ncp').ncp;
    const [src, dest] = resolvePaths(srcName, destRoot, destName);
    console.log(`... copying '${src}' -> '${dest}'`);
    ncp(src, dest, err => {
            if (err) reject(err);
            else resolve();
        });    
});

async function renderTemplate (srcName, destRoot, destName, options) {
    const [src, dest] = resolvePaths(srcName, destRoot, destName);
    console.log(`... rendering '${src}' -> '${dest}'`);
    const source = fs.readFileSync(src, "utf8");
    const evaluate = olo.document.parse(source);
    const context = olo.document.createContext(options);
    const {text} = await evaluate(context);
    fs.writeFileSync(dest, text, "utf8");
}

function resolvePaths (srcName, destRoot, destName) {
    const src = pathlib.join(__dirname, '../dist', srcName);
    const dest = pathlib.join(destRoot, destName || srcName);
    return [src, dest];
}
