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
            this.$refs.self.$el.addEventListener('focusout', (event) => {
                // emit 'context-menu-blur' if the context menu looses focus
                // the client components will normally hide the context menu
                // as a consequence of this event
                if (this.$refs.self.$el.contains(event.relatedTarget)) {
                    // if the context menu looses focus because a menu item has
                    // been clicked, delays the `context-menu-blur` event so that
                    // the item action can be executed
                    setTimeout(() => this.$emit('context-menu-blur'), 250);
                } else {
                    this.$emit('context-menu-blur');
                }
            });
        }
    }
</script>

<style>
    .context-menu {
        position: absolute;
        border: 1px solid #1976D2;
        min-width: 12em;
    }
    .context-menu:focus {
        outline: none;
    }
</style>
