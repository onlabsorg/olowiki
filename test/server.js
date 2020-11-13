var olojs = require("@onlabsorg/olojs");

var environment = new olojs.Environment({
    store: new olojs.stores.Router({
        '/': new olojs.stores.File(`${__dirname}/root`),
        '/path/to/': new olojs.stores.File(`${__dirname}/path-to`)
    })
});


var Server = require('../server');
var server = Server(environment);

server.listen(8010, error => {
    if (error) throw error;
    else console.log("HTTP olowiki server listening on port 8010");
});
