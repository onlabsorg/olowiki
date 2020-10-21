const Vue = require("vue/dist/vue.js");

document.addEventListener("DOMContentLoaded", () => {    
    
    window.vue = new Vue({        
        
        components: { 
            'olo-editor': require("../src/index")
        },

        el: "#olo-editor-test",
        
        data: {
            doc: require("./test-document"),
        },
        
        methods: {
            
            printDoc: function () {
                console.log( String(this.doc) );
            },
            
            commit: function () {
                this.$refs.editor.commit();
            }
        }
    });
});
