<template>
    <ace-editor ref="oloEditor" class="olo-editor" 
                v-model="content"
                @init="initEditor"
                lang="oloml"
                :theme="theme"
                :options="editorOptions">
                </ace-editor>
</template>

<script>
    const olojs = require("olojs");

    module.exports = {

        components: {
            'ace-editor': require('vue2-ace-editor'),
        },
        
        props: ['doc'],

        data: () => Object({
            
            content: "",
            
            theme: "chrome",
            
            editorOptions: {
                fontSize: "12pt",
                //showLineNumbers: false,
                //showGutter: false
            }
        }),
        
        watch: {
            'doc': function () {
                this.updateContent();
            }
        },
        
        computed: {
            editor: function () {
                return this.$refs.oloEditor.editor;
            }
        },
        
        methods: {
            
            initEditor () {
                require('brace/ext/language_tools'); //language extension prerequsite...
                require('./oloml-mode');
                require('brace/theme/chrome');
                require('brace/ext/searchbox');
            },
            
            updateContent () {
                this.content = this.doc.source;
            },
            
            commit () {
                this.doc.source = this.content;                        
            },
            
            focus () {
                this.editor.focus();
            },
            
            insertExpression () {
                const position = this.editor.getCursorPosition();
                this.editor.session.insert(position, "<%  %>");
                this.editor.selection.moveTo(position.row, position.column+3);
            }
        },
        
        mounted () {
            this.editor.commands.addCommand({
                name: "insert-expression",
                exec: () => this.insertExpression(),
                bindKey: {mac: "cmd-space", win: "ctrl-space"}
            })            
            this.updateContent();
            this.focus();
        }
    }
</script>

<style>
    .ace_scrollbar-v, .ace_scrollbar-h {
        display: none;
    }
</style>
