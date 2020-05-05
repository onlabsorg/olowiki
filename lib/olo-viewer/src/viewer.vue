<template>
    <div class="olo-viewer" v-html="content"></div>
</template>



<script>

    module.exports = {
        
        props: ['content'],
    };

</script>



<style>

    @import "typography.css";

    .olo-viewer .error {
        font-family: monospace;
        color: yellow;
        background-color: red;
        padding-left: 1em;
        padding-right: 1em;
    }
        
</style>
