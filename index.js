
const olojs = require('@onlabsorg/olojs');
const pathlib = require("path");

exports.commands = {
    
    olowiki (store, options) {
        const portNumber = options.port || 8010;
        const server = olojs.HTTPServer.createServer(store, {
            publicPath: pathlib.join(__dirname, "./public")
        });
        return new Promise((resolve, reject) => {
            server.listen(portNumber, err => {
                if (err) reject(err);
                else {
                    console.log(`olowiki HTTP server listening on port ${portNumber}`);
                    resolve(server);
                }
            });
        });
    }
}
