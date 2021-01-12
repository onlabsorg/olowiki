
const olojs = require('@onlabsorg/olojs');
const Server = require('../index').servers.olowiki;

const server = Server(new olojs.FileStore(`${__dirname}/repo`));

const port = 8010;
server.listen(port, error => {
    if (error) throw error;
    console.log(`olowiki test server listening on port ${port}`);
});
