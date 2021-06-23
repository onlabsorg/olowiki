
// TEMPLATE
const template = `<div class="vue-olo-viewer" v-html="html"></div>`;



// SCRIPT
const DOMPurify = require("dompurify");
const Vue = require("vue/dist/vue");
Vue.use( require('vue-async-computed').default );

module.exports = store => ({
    
    template: template,
    
    props: ['src'],
    
    asyncComputed: {
        
        async html () {
            const {text} = await store.load(this.src);
            return DOMPurify.sanitize(text);
        }
    }
});



// STYLE
require('./src/typography.css');

