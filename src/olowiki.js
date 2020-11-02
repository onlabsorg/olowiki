
const olojs = require('@onlabsorg/olojs/browser');

const olonv = window.olonv = new olojs.Environment({
    store: new olojs.stores.HTTP(`${location.origin}/env`),
    
    globals: {
        $renderError (error) {
            return `<pre class="runtime-error">` +
                        `<div class="message">${escape(error.message)}</div>` +
                        `<br>` +
                        `<div class="source">${escape(error.source)}</div>` +
                        `<div class="source">${escape(error.swanStackStr)}</div>` +
                   `</pre>`;
        }                    
    }
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



// -----------------------------------------------------------------------------
//  SERVICE FUNCTIONS
// -----------------------------------------------------------------------------

const escape = html => html
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
