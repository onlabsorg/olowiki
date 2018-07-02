module.exports = {
    
    template: `<iframe class="olo-sandbox" style="width:100%"
                       sandbox="allow-scripts allow-same-origin"  
                       src="/lib/client/olo-sandbox.html" 
                       @load="ready=true">
               </iframe>`,
    
    props: [ 'content' ],
    
    data: () => Object({
        ready: false
    }),
    
    watch: {

        content: function () {
            if (this.ready) this.render();
        },
        
        ready: function () {
            if (this.ready) this.render();
        }
    },
    
    methods: {
        
        render () {
            const iframe = this.$el;
            const body = iframe.contentWindow.document.querySelector("body");
            body.innerHTML = this.content;
            iframe.style.height = this.content ? `${body.offsetHeight}px` : "0px";
        },
    }
}
