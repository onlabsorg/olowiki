
const Vue = require("vue/dist/vue.js");



document.addEventListener("DOMContentLoaded", function () {

    const view = new Vue({
        
        el: "olo-wiki",
        
        components: { 
            'olo-wiki': require("./olowiki.vue").default,
        },
        
        data: {    
            docURI: location.hash.slice(1),
        },
                
        // methods: {},
        
        async mounted () {
            window.addEventListener("hashchange", (event) => {
                this.docURI = location.hash.slice(1);
            });
            if (location.hash === "" || location.hash === "#") {
                location.hash = "/index"
            }
            console.log(`olowiki ready!`);
        }
    });
});
