
const olojs = require('@onlabsorg/olojs');
const serve = require('../index').commands.olowiki;

serve(new olojs.FileStore(`${__dirname}/repo`), {port:8020});
