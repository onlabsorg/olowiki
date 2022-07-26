
import * as olo from '@onlabsorg/olojs/browser';
window.olo = olo;

import Wiki from './wiki';
olo.Wiki = Wiki;
olo.Wiki.version = require('../package.json').version;
