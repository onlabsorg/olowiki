require("./olo-viewer.css");


const sanitize = require("./utils/sanitize");



module.exports = {
    
    template: `<div class="olo-viewer" v-html="saneHTML"></div>`,
    
    props: [ 'content', 'allowed_tags' ],
    
    computed: {
        saneHTML: function () {
            return sanitize(this.content, this.allowed_tags);
        }
    },    
}
