
const Vue = require("vue/dist/vue.js");



document.addEventListener("DOMContentLoaded", function () {

    const view = new Vue({
        
        el: "olowiki-document",
        
        components: { 
            'olowiki-document': require("./document.vue").default,
        },
        
        data: {
            href: location.href,
        },
        
        //computed: {},
        
        async mounted () {
            window.addEventListener("hashchange", (event) => {
                this.href = location.href;
            });
            console.log(`olowiki-document ready!`);
        }
    });
});
