
const olo = require("./olo");

const HTTPStore = require("./client/http-store");
const store = HTTPStore(olo);


olo.engine.config.elements.import = {
    allowedAttributes: [ 'href', 'name' ],
    beforeRendering: async function (scope) {
        const targetDoc = await store.read(this.attributes.href);
        const targetScope = {};
        await olo.engine.render(targetDoc.template, targetScope);
        scope[this.attributes.name] = targetScope;
    }
};


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
