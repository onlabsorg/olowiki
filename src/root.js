const Vue = require("vue/dist/vue.js");



document.addEventListener("DOMContentLoaded", function () {

    const view = new Vue({
        
        el: "olowiki-root",
        
        components: { 
            'olowiki-root': require("./root.vue").default,
        },
        
        //data: {},
        
        //computed: {},
        
        async mounted () {
            console.log(`olowiki-root ready!`);
        }
    });
});
