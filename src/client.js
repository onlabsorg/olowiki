
const olo = require("./olo");

const HTTPStore = require("./olo/http-store");
const store = HTTPStore();


require("./client/plugins/import")(store);
require("./client/plugins/markdown")();


const Vue = require("vue/dist/vue.js");
const OloUI = require("./client/olo-ui.js");

const domready = require('./client/utils/domready');
domready().then(() => {

    const doc = new olo.Document(document.documentElement.innerHTML);

    const oloVueRoot = document.createElement('olo-ui');
    document.body.appendChild(oloVueRoot);
    
    olo.vue = new Vue({
        
        el: "olo-ui",
        
        components: {
            'olo-ui': OloUI(doc, store),
        }        
    });    
});



module.exports = window.olo = olo;
