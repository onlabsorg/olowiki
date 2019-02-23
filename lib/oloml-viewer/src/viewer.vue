<template>
    <div class="oloml-viewer" v-html="html"></div>
</template>

<script>
    const Vue = require("vue/dist/vue.js");
    const render = require('./render');

    module.exports = {
        
        props: ['source', 'path'],
        
        data: () => Object({
            html: ""
        }),
        
        watch: {
            
            'source': function () {
                this.render();
            },
            
            'path': function () {
                this.render();
            }
        },
        
        methods: {
            
            async render () {
                this.html = await render(this.source, this.path);
            }
        },
        
        mounted () {
            this.render();
        }            
    };
</script>

<style>
    @import "typography.css";

    .oloml-viewer {
        display: block;
        margin: 0;
        outline: 0;
        border: 0;
        padding: 0;
    }
</style>
