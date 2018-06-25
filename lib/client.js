
const olo = module.exports = window.olo = {};
olo.Document = require("./olojs/document");

const HTTPStore = require("./olojs/stores/http-store-client");
const store = new HTTPStore();

const auth = require('./client/auth');


require("./client/plugins/set")();
require("./client/plugins/import")(store, auth);
require("./client/plugins/markdown")();


const Vue = require("vue/dist/vue.js");
const OloDocument = require("./client/olo-document.js");



const domready = require('./client/utils/domready');
domready().then(() => {

    olo.vue = new Vue({
    
        el: "olo-document",
    
        components: {
            'olo-document': OloDocument(store, auth),
        }        
    });    
    
});
