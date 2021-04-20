const olojs = window.olojs = require('@onlabsorg/olojs/browser');

const Vue = require("vue/dist/vue.js");
const OloWiki = require("./olo-wiki/olo-wiki");

window.olowiki = {

    init (domElement, store) {

        // store.globals.$renderError = error =>
        //         `<pre class="runtime-error">` +
        //             `<div class="message">${escape(error.message)}</div>` +
        //             (error.swanStack ? `<br><div class="source">${escape(error.swanStack)}</div>` : "") +
        //         `</pre>`;

        this.vue = new Vue({

            el: domElement,

            template: `<olo-wiki ref="wiki" :src="hash"></olo-wiki>`,

            components: {
                'olo-wiki': OloWiki(store),
            },

            data: {
                'store': store,
                'hash': location.hash.slice(1),
            },

            async mounted () {
                window.addEventListener("hashchange", (event) => {
                    this.hash = location.hash.slice(1);
                });
            }
        });
    },

    get version () {
        return require('../package.json').version;
    },

    get doc () {
        return this.vue.$refs.wiki.doc;
    }
};


// -----------------------------------------------------------------------------
//  SERVICE FUNCTIONS
// -----------------------------------------------------------------------------

const escape = html => html
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
