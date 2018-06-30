module.exports = {
    
    template: `<iframe class="olo-sandbox" sandbox="allow-scripts allow-same-origin" style="width:100%; height:100%;" src="/lib/client/olo-sandbox.html"></iframe>`,
    
    props: [ 'content' ],
    
    watch: {

        content () {
            this.render();
        }
    },
    
    methods: {
        
        render () {
            const contentWindow = this.$el.contentWindow;
            contentWindow.postMessage(this.content, window.location.origin);
        }
    },
    
    mounted () {
        this.render();
    }
}
