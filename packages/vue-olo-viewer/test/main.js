const Vue = require("vue/dist/vue");
const VueOloViewer = require('../index');
const olojs = require('@onlabsorg/olojs/browser');

const testdoc = `
<h1>vue-olo-viewer test</h1>
<p>3 + 2 = <% 3+2 %></p>
`;

const store = new olojs.MemoryStore({testdoc});

document.addEventListener("DOMContentLoaded", function () {
    
    const app = new Vue({
        
        el: '#root',
        
        components: {
            'vue-olo-viewer': VueOloViewer(store)
        }
        
    });    
});



