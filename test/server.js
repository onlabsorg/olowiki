var olojs = require("@onlabsorg/olojs");

var environment = new olojs.Environment({
    
    store: new olojs.stores.Router({
        home: new olojs.stores.FS(`${__dirname}/repo`),
        temp: new olojs.stores.Memory(),
        http: new olojs.stores.HTTP('http://'),
        https: new olojs.stores.HTTP('https://')
    })
});


var Server = require('../server');
var server = Server(environment);

server.listen(8010, error => {
    if (error) throw error;
    else console.log("HTTP olowiki server listening on port 8010");
});
