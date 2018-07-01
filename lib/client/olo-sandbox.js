module.exports = {
    
    template: `<iframe class="olo-sandbox" 
                       sandbox="allow-scripts allow-same-origin" 
                       style="width:100%" 
                       src="/lib/client/olo-sandbox.html" 
                       @load="ready=true">
               </iframe>`,
    
    props: [ 'content' ],
    
    data: () => Object({
        ready: false
    }),
    
    watch: {

        content: function () {
            this.render();
        },
        
        ready: function () {
            this.render();
        }
    },
    
    methods: {
        
        render () {
            if (!this.ready) return;
            const iframe = this.$el;
            const body = iframe.contentWindow.document.querySelector("body");
            body.innerHTML = this.content;
            iframe.style.height = this.content ? `${body.offsetHeight}px` : "0px";
        },
    }
}
