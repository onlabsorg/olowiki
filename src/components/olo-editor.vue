<template>
    <div ref="root" class="vue-olo-editor"></div>
</template>


<script>
    const ace = require('brace');

    module.exports = {
        
        props: {
            value: String,              // the document text
            fontsize: [Number, String], // the font size in pt (default 12)
            theme: String,              // the ace theme to be applied to this instance
        },
        
        data: () => ({
            editor: null,
        }),
        
        watch: {
            
            value () {
                this.updateValue();
            },
            
            fontsize () {
                this.updateFontSize();
            },
            
            theme () {
                this.updateTheme();
            }
        },
        
        computed: {},
        
        methods: {
            
            // update the editor content with the `value` prop
            updateValue () {
                const content = this.editor.getValue();
                if (this.value !== content) {
                    this.editor.session.setValue(this.value);                
                }
            },
            
            // update the font size based on the `fontsize` attribute value
            updateFontSize () {
                const pt = Number(this.fontsize) || 12;
                const px = pt / 72 * 96;
                this.editor.setFontSize(px);
            },
            
            // update the editor theme, based on the `theme` attribute value 
            async updateTheme () {
                const themeName = this.theme || 'chrome';
                require(`brace/theme/${themeName}`);
                this.editor.setTheme(`ace/theme/${themeName}`);
            },
            
            // inserts an expression field `<%  %>` at the current cursor position
            insertExpression () {
                const position = this.editor.getCursorPosition();
                this.editor.session.insert(position, "<%  %>");
                this.editor.selection.moveTo(position.row, position.column+3);
            },        
            
            // set focus on the editor
            focus () {
                this.editor.focus();
            }
        },
        
        mounted () {
            
            // load the ace editor
            this.editor = ace.edit(this.$refs.root);
            this.editor.$blockScrolling = Infinity;
            //this.editor.setOptions(options);
            
            // add the seach box plugin
            require('brace/ext/searchbox');
            
            // set the language
            require('brace/ext/language_tools'); //language extension prerequsite...
            require('./olo-editor-mode');
            this.editor.getSession().setMode('ace/mode/oloml');
            
            // add the 'insert-expression' command
            this.editor.commands.addCommand({
                name: "insert-expression",
                exec: () => this.insertExpression(),
                bindKey: {mac: "cmd-space", win: "ctrl-space"}
            });
            
            // update the editor content with the `value` attribute
            if (this.value) this.updateValue();
            
            // apply the passed attributes
            this.updateFontSize();  
            this.updateTheme();

            // update the `value` prop on content changes
            this.editor.on('change', () => {
                this.$emit('input', this.editor.getValue());
            });

            // focus
            this.focus();
        },
        
        beforeDestroy () {
            this.editor.destroy();
        }
    }
</script>

<style>
    .ace_scrollbar-v, .ace_scrollbar-h {
        display: none;
    }
    
    .vue-olo-editor {
        width: 100%;
        height: 100%;
    }
</style>