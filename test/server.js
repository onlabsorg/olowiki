
const olojs = require('@onlabsorg/olojs');
const olowiki = require('../index');

const store = new olojs.FileStore(`${__dirname}/repo`);
const server = olowiki.createServer(store);
server.listen(8010, err => {
    if (err) throw err;
    console.log('olo-wiki http server listening on port 8010');
});
