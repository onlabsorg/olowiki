<template>
    <div ref="root" class="olo-viewer" v-html="html"></div>
</template>

<script>
    const Vue = require("vue/dist/vue.js"); 
    const DOMPurify = require("dompurify");    
    
    module.exports = {
        
        props: ['doc'],
        
        data: () => ({
            html: "",
            localScope: {
                inputs: {},
                input (name, options={}) {
                    const type = options.type || "text";
                    switch (type) {
                        case "select":
                            var values = options.values || [];
                            var value = options.value || options.values[0] || "";
                            if (this.inputs[name] === undefined) this.inputs[name] = value;
                            var selectOptions = values.map(sOpt => `<option value="${sOpt}" ${this.inputs[name] === sOpt ? "selected" : ""}>${sOpt}</option>`).join("");
                            return `<select id=${name}>${selectOptions}</select>`
                        case "text":
                        default:
                            var value = options.value || "";
                            if (this.inputs[name] === undefined) this.inputs[name] = value;                        
                            return `<input id="${name}" type="${type}" value="${value}"/>`;
                    }
                }
            }
        }),
        
        watch: {
            'doc': function (oldDoc, newDoc) {
                this.render();
            }
        },
        
        methods: {
        
            async render () {
                const originalContext = this.doc.context;
                this.doc.context = Object.create(originalContext);
                Object.assign(this.doc.context, this.localScope);
                const docNS = await this.doc.evaluate();
                this.doc.context = originalContext;
                
                this.$emit("rendered", docNS);
                
                const rawHTML = docNS.fragment !== undefined ? String(docNS.fragment) : String(docNS);                
                this.html = DOMPurify.sanitize( rawHTML );                
            }
        },
        
        mounted () {
            this.$refs.root.addEventListener('change', (event) => {
                if (event.target.id) {
                    this.localScope.inputs[event.target.id] = event.target.value;
                    this.render();
                }
            }); 
            
            this.render();            
        }
    };            
</script>

<style>

    @import "typography.css";

    .olo-viewer {
        display: block;
        padding: 2em 20% 2em 20%;
    }
    
    @media (max-width: 480px) { 
        .text-view {
            padding-left: 3%;
            padding-right: 3%;
        }
    }    

    .olo-viewer .error {
        font-family: monospace;
        color: yellow;
        background-color: red;
        padding-left: 1em;
        padding-right: 1em;
    }

</style>
