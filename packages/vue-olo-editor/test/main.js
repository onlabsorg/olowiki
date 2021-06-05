const Vue = require("vue/dist/vue");
const olojs = require('@onlabsorg/olojs/browser');

const testdoc = `
<h1>vue-olo-editor test</h1>
<p>3 + 2 = <% 3+2 %></p>
`;

const store = new olojs.MemoryStore({testdoc});

document.addEventListener("DOMContentLoaded", function () {
    
    const app = new Vue({
        
        el: '#root',
        
        data: {
            source: testdoc,
            fontsize: 10,
            theme: "chrome",
        },
        
        watch: {
            source () {
                console.log({source_change: this.source});
            }
        },
        
        components: {
            'vue-olo-editor': require('../index')
        },
        
        methods: {
            applyHashArguments () {
                const args = parseHash(location.hash.slice(1));
                this.fontsize = args.fontsize;
                this.theme = args.theme;
            }
        },
        
        mounted () {
            window.addEventListener('hashchange', () => this.applyHashArguments());
            this.applyHashArguments();
        }
    });    
});



function parseHash (hash) {
    const args = {};
    const key_value_pairs = hash.split('&');
    for (let pair of key_value_pairs) {
        const [key, value] = pair.split('=');
        const number = Number(value);
        args[key.trim()] = isNaN(number) ? value.trim() : number;
    }
    return args;
}



