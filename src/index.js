// polifill for async generators, used by  babel
window.regeneratorRuntime = require("regenerator-runtime");


const olo = window.olo = require('@onlabsorg/olojs/browser');
olo.Wiki = require('./wiki');

// olojs.IPFSStore = urls => {
//     const IPFSNode = require('@onlabsorg/ipfs-store/lib/ipfs-node');
//     const {IPFSStore} = require('@onlabsorg/ipfs-store');
//     return new IPFSStore( IPFSNode(urls) );
// }


