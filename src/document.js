
const Vue = require("vue/dist/vue.js");



document.addEventListener("DOMContentLoaded", function () {

    const view = new Vue({
        
        el: "olowiki-document",
        
        components: { 
            'olowiki-document': require("./document.vue").default,
        },
        
        data: {    
            locationHRef: location.href,
        },
        
        computed: {
            
            href: () => {
                const url = new URL(this.locationHRef || location.href);
                if (url.pathname.slice(-5) === ".html") {
                    url.pathname = url.pathname.slice(0, -5);
                }
                return url.href;                    
            }
        },
        
        // methods: {},
        
        async mounted () {
            window.addEventListener("hashchange", (event) => {
                this.locationHRef = location.href;
            });
            console.log(`olowiki-document ready!`);
        }
    });
});
