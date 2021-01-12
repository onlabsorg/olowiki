
const olojs = require('@onlabsorg/olojs');
const pathlib = require("path");

exports.servers = {
    olowiki: store => olojs.HTTPServer.createServer(store, {
        publicPath: pathlib.join(__dirname, "./public")
    })
}
