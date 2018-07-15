
const olo = window.olo = {};

const Store = require("./client/store");
const store = new Store();

const auth = require('./client/auth');

const engine = require("./olojs/engine");
engine.loaders.markdown = () => import(/* webpackChunkName: "markdown-engine" */ './olojs/engines/markdown');
engine.loaders.mustache = () => import(/* webpackChunkName: "mustache-engine" */ './olojs/engines/mustache');




const Vue = require("vue/dist/vue.js");
const OloDocument = require("./client/olo-webui.js");

const domready = require('./client/utils/domready');
domready().then(() => {

    olo.vue = new Vue({
    
        el: "olo-webui",
    
        components: {
            'olo-webui': OloDocument(store, auth),
        }        
    });    
    
});
