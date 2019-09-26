<template>
    <md-card class="store-card">
        <md-card-header>
            <md-icon>folder</md-icon>
            <a class="md-title" :href="path">{{title}}</a>
        </md-card-header>

        <md-card-content>
            <slot name="content"></slot>
        </md-card-content>

        <md-card-actions>
            <slot name="button"></slot>
        </md-card-actions>
    </md-card>
</template>

<script>
    const Vue = require("vue/dist/vue");
    Vue.use( require("vue-material/dist/components/MdCard").default );
    Vue.use( require("vue-material/dist/components/MdContent").default );
    Vue.use( require("vue-material/dist/components/MdButton").default );    
    Vue.use( require("vue-material/dist/components/MdIcon").default );    

    module.exports = {
        
        //components: {},
        
        props: ['name', 'title'],
        
        // data: () => Object({}),  
        
        computed: {
            'path': function () {
                return `/${this.name}/`;
            }
        },
        
        // methods: {},
        
        // mounted () {}
    };
</script>

<style>

    .store-card .md-card-header {
        display: flex;
        flex-wrap: nowrap;
        border-bottom: 1px solid var(--md-theme-default-divider, rgba(0,0,0,0.12));      
    }

    .store-card .md-card-header .md-icon {
        flex: 0 0 auto;
        margin-right: 1em;
    }

    .store-card .md-card-header .md-title {
        flex: 1 1 auto;
    }

    .store-card div.content {
        margin: 2em 10% 2em 10%;
    }

    .store-card div.content .md-card {
        margin-bottom: 1em;
    }
    
    .store-card .md-card-content {
        font-size: 16px;
    }
</style>
