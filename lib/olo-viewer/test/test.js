const Vue = require("vue/dist/vue.js");

const olojs = require("olojs");
const hub = new olojs.Hub();
hub.stores.set("jss://test-store", {
    read: async function (path) {
        const request = await fetch(`store${path}.olo`);
        if (!request.ok) throw new Error(`Document not found: "${path}"`);
        return await request.text();
    }    
});
hub.scope.object = {x:10, y:20, z:30, a:[1,2,3], o:{a:1,b:2,c:3}};


document.addEventListener("DOMContentLoaded", async () => {

    window.vue = new Vue({        
        
        components: { 
            'olo-viewer': require("../src/index")
        },

        el: "#olo-viewer-test",
        
        data: {
            doc: hub.create("jss://test-store/document1#instructions", ""),
            src: "jss://test-store/document1"
        },
        
        watch: {
        
            'src': function () {
                this.updateDocument();
            }
        },
        
        methods: {
        
            updateDocument: async function () {
                this.doc = await hub.read(this.src);
            }
        },
        
        mounted: function () {
            this.updateDocument();
        }
    });
});
