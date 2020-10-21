
const olojs = require('@onlabsorg/olojs/browser');

const olonv = window.olonv = new olojs.Environment({
    store: new olojs.stores.HTTP(`${location.origin}/env`),
});

olonv.olowikiVersion = require('../package.json').version;

olonv.document = {};



const Vue = require("vue/dist/vue.js");
Vue.use( require("vue-async-computed") );

document.addEventListener("DOMContentLoaded", function () {

    const view = new Vue({
        
        el: "olo-wiki",
        
        components: { 
            'olo-wiki': require("./olo-wiki/olo-wiki.vue").default,
        },
        
        data: {    
            docURI: location.hash.slice(1),
        },
        
        methods: {
            
            normalizeHash: function () {

                if (!location.hash || location.hash === "#") {
                    location.hash = "/index"
                }
                
                let [docPath, docArgs] = location.hash.slice(1).split("?"); 
                if (docPath.slice(-1) === "/") {
                    location.hash = docPath + "index" + (docArgs ? `?${docArgs}` : "");
                }
                
                return location.hash.slice(1);
            }
        },
        
        async mounted () {
            window.addEventListener("hashchange", (event) => {
                this.docURI = this.normalizeHash();
            });
            this.docURI = this.normalizeHash();
            console.log(`olowiki ready!`);
        }
    });
});
