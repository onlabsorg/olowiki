<template>
    <div class="comments-stack">
        
        <md-card v-for="comment in comments" class="md-elevation-1">
            <md-card-header>
                <b>{{comment.author}}</b> commented on <b>{{date(comment)}}</b> at <b>{{time(comment)}}</b> 
            </md-card-header>            
            <md-card-content class="post-content" v-html="comment.content.__str__"></md-card-content>
        </md-card>
    </div>
</template>



<script>
    const olonv = require("./olowiki-environment");
    
    const Vue = require("vue/dist/vue");
    Vue.use( require("vue-material/dist/components/MdCard").default );    
    Vue.use( require("vue-material/dist/components/MdField").default );    
    Vue.use( require("vue-material/dist/components/MdButton").default );    

    module.exports = {
        
        props: ['comments'],  
        
        data: () => ({}),
        
        methods: {
            
            date (comment) {
                return (new Date(comment.time)).toLocaleDateString();
            },
            
            time (comment) {
                const date = new Date(comment.time);
                const hours = ensureTwoDigits(date.getHours());
                const minutes = ensureTwoDigits(date.getMinutes());
                return `${hours}:${minutes}`;
            }
        },
    }
    
    function ensureTwoDigits (n) {
        return n < 10 ? `0${n}` : String(n);
    }
</script>             



<style scoped>

    .md-card {
        margin: 0 1em 1em 1em;
        display: block;
        font-size: 0.8em;
    }
    
    .md-card-header {
        color: #808080;
    }
    
    div.md-field.md-theme-default.md-has-textarea {
        margin-bottom: 4px;
    }
</style> 
