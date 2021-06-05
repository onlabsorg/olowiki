
const DOMPurify = require("dompurify");

const Vue = require("vue/dist/vue");
Vue.use(require('vue-async-computed').default);

require('./main.css');

module.exports = store => ({
    
    template: `<div class="vue-olo-viewer" v-html="html"></div>`,
    
    props: ['src'],
    
    asyncComputed: {
        
        async html () {
            const {text} = await store.load(this.src);
            return DOMPurify.sanitize(text);
        }
    }
});