
const olo = module.exports = window.olo = {};
const Document = olo.Document = require("./olojs/document");

const HTTPStore = require("./olojs/stores/http-store-client");
const store = new HTTPStore();

const auth = require('./client/auth');

require("./olojs/plugins/markdown")(Document);
require("./olojs/plugins/import")(Document, 
        href => store.readDocument(href, auth.getToken()));



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
