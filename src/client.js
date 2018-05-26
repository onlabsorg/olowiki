
const olo = require("./olo");

const HTTPStore = require("./client/http-store");
const store = HTTPStore(olo);


require("./client/plugins/import")(store);
require("./client/plugins/markdown")();


const Vue = require("vue/dist/vue.js");
const OloUI = require("./client/olo-ui.js");

const domready = require('./client/utils/domready');
domready().then(() => {

    const oloVueRoot = document.createElement('olo-ui');
    document.body.appendChild(oloVueRoot);

    olo.vue = new Vue({
        
        el: "olo-ui",
        
        components: {
            'olo-ui': OloUI(olo.engine, store),
        }        
    });    
});



module.exports = window.olo = olo;
