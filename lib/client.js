
const olo = module.exports = window.olo = {};
olo.Document = require("./olojs/document");

const HTTPStore = require("./olojs/stores/http-store-client");
const store = new HTTPStore();


require("./client/plugins/import")(store);
require("./client/plugins/markdown")();


const Vue = require("vue/dist/vue.js");
const OloUI = require("./client/olo-ui.js");

const domready = require('./client/utils/domready');
domready().then(() => {

    const doc = olo.Document.parse(document.documentElement.innerHTML);

    const oloVueRoot = document.createElement('olo-ui');
    document.body.appendChild(oloVueRoot);
    
    olo.vue = new Vue({
        
        el: "olo-ui",
        
        components: {
            'olo-ui': OloUI(doc, store),
        }        
    });    
});
