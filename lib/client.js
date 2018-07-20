
const olo = window.olo = {};

const Store = require("./client/store");
const auth = require('./client/auth');
const OloWebUI = require("./client/olo-webui.js");

require("./client.css");

OloWebUI({
    
    store: new Store(), 
    
    auth: auth,
    
    engineLoaders: {
        markdown: () => import(/* webpackChunkName: "markdown-engine" */ './olojs/engines/markdown'),
        mustache: () => import(/* webpackChunkName: "mustache-engine" */ './olojs/engines/mustache'),        
    }
    
}).then(oloWebUI => {
    olo.webui = oloWebUI;
})
