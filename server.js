const olojs = require('@onlabsorg/olojs');
const pathlib = require("path");

module.exports = environment => olojs.servers.http(environment, {
    publicPath: pathlib.join(__dirname, "./public")
});
