const Vue = require("vue/dist/vue.js");



document.addEventListener("DOMContentLoaded", function () {

    const view = new Vue({
        
        el: "olowiki-container",
        
        components: { 
            'olowiki-container': require("./container.vue").default,
        },
        
        //data: {},
        
        //computed: {},
        
        async mounted () {
            console.log(`olowiki-container ready!`);
        }
    });
});
