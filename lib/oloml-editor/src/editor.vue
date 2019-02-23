<template>
    <ace-editor class="olo-editor"
                v-model="content"
                @init="initEditor"
                lang="yaml"
                :theme="theme"
                :options="editorOptions">
            </ace-editor>
</template>

<script>
    module.exports = {

        components: {
            'ace-editor': require('vue2-ace-editor'),
        },
        
        props: ['value', 'theme'],

        data: () => Object({
            editorOptions: {
                fontSize: "12pt",
                //showLineNumbers: false,
                //showGutter: false
            }
        }),
        
        computed: {
            
            content: {
                get () {
                    return this.value;
                },
                set (newContent) {
                    this.$emit('input', newContent);                    
                }
            }        
        },
        
        methods: {
            
            initEditor () {
                require('brace/ext/language_tools'); //language extension prerequsite...
                require('brace/mode/yaml');
                require('brace/theme/chrome');
                require('brace/theme/monokai');
            }
        }
    }
</script>

<style>
    .ace_scrollbar-v, .ace_scrollbar-h {
        display: none;
    }
</style>
