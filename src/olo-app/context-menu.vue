<template>
    <md-card ref="self" class="context-menu md-elevation-5"
            v-bind:style="{left:x+'px', top:y+'px'}" tabindex="0">
        <md-list>
            <slot name="context-menu-item"></slot>
        </md-list>
    </md-card>
</template>

<script>
    const Vue = require("vue/dist/vue");
    Vue.use( require("vue-material/dist/components/MdCard").default );     
    Vue.use( require("vue-material/dist/components/MdList").default );     

    module.exports = {   
        name: "context-menu",
         
        props: ['x', 'y'],
        
        mounted () {
            this.$refs.self.$el.focus();
            this.$refs.self.$el.addEventListener('focusout', () => {
                setTimeout(() => this.$emit('context-menu-blur'), 250);
            });
        }
    }
</script>

<style>
    .context-menu {
        position: absolute;
        border: 1px solid #D0D0D0;
    }
    .context-menu:focus {
        outline: none;
    }
</style>
