<template>
    <ace-editor ref="oloEditor" class="olo-editor" 
                v-model="content"
                @init="initEditor"
                lang="oloml"
                :options="editorOptions">
                </ace-editor>
</template>

<script>
    module.exports = {

        components: {
            'ace-editor': require('vue2-ace-editor'),
        },
        
        props: ['source', 'theme'],

        data: () => Object({
            
            content: "",
            
            editorOptions: {
                fontSize: "12pt",
                //showLineNumbers: false,
                //showGutter: false
            }
        }),
        
        watch: {
            source: function () {
                this.updateContent();
            },
            theme: function () {
                this.updateTheme();
            }
        },
        
        computed: {
            editor: function () {
                return this.$refs.oloEditor.editor;
            },
            themeId: function () {
                return this.theme || "chrome";
            }
        },
        
        methods: {
            
            initEditor () {
                require('brace/ext/language_tools'); //language extension prerequsite...
                require('./oloml-mode');
                require(`brace/theme/chrome`);
                require(`brace/theme/${this.themeId}`);
                require('brace/ext/searchbox');
                this.updateTheme();
            },
            
            updateContent () {
                this.content = this.source;
            },
            
            updateTheme () {
                this.editor.setTheme(`ace/theme/${this.themeId}`);
            },
            
            commit () {
                this.$emit('update:source', this.content);
            },
            
            focus () {
                this.editor.focus();
            },
            
            getTheme () {
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
