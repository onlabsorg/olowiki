var ace = require('brace');
require('./editor.css');



module.exports = {
    
    template: `<div ref="root" class="vue-olo-editor"></div>`,
    
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
        require('./oloml-mode');
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





const options = ({
    // editor options
    selectionStyle: 'line',// "line"|"text"
    highlightActiveLine: true, // boolean
    highlightSelectedWord: true, // boolean
    readOnly: false, // boolean: true if read only
    cursorStyle: 'ace', // "ace"|"slim"|"smooth"|"wide"
    mergeUndoDeltas: true, // false|true|"always"
    behavioursEnabled: true, // boolean: true if enable custom behaviours
    wrapBehavioursEnabled: true, // boolean
    autoScrollEditorIntoView: undefined, // boolean: this is needed if editor is inside scrollable page
    keyboardHandler: null, // function: handle custom keyboard events
    
    // renderer options
    animatedScroll: false, // boolean: true if scroll should be animated
    displayIndentGuides: false, // boolean: true if the indent should be shown. See 'showInvisibles'
    showInvisibles: false, // boolean -> displayIndentGuides: true if show the invisible tabs/spaces in indents
    showPrintMargin: true, // boolean: true if show the vertical print margin
    printMarginColumn: 80, // number: number of columns for vertical print margin
    printMargin: undefined, // boolean | number: showPrintMargin | printMarginColumn
    showGutter: true, // boolean: true if show line gutter
    fadeFoldWidgets: false, // boolean: true if the fold lines should be faded
    showFoldWidgets: true, // boolean: true if the fold lines should be shown ?
    showLineNumbers: true,
    highlightGutterLine: false, // boolean: true if the gutter line should be highlighted
    hScrollBarAlwaysVisible: false, // boolean: true if the horizontal scroll bar should be shown regardless
    vScrollBarAlwaysVisible: false, // boolean: true if the vertical scroll bar should be shown regardless
    fontSize: 12, // number | string: set the font size to this many pixels
    fontFamily: undefined, // string: set the font-family css value
    maxLines: undefined, // number: set the maximum lines possible. This will make the editor height changes
    minLines: undefined, // number: set the minimum lines possible. This will make the editor height changes
    maxPixelHeight: 0, // number -> maxLines: set the maximum height in pixel, when 'maxLines' is defined. 
    scrollPastEnd: 0, // number -> !maxLines: if positive, user can scroll pass the last line and go n * editorHeight more distance 
    fixedWidthGutter: false, // boolean: true if the gutter should be fixed width
    theme: 'ace/theme/textmate', // theme string from ace/theme or custom?
    
    // mouseHandler options
    scrollSpeed: 2, // number: the scroll speed index
    dragDelay: 0, // number: the drag delay before drag starts. it's 150ms for mac by default 
    dragEnabled: true, // boolean: enable dragging
    focusTimout: 0, // number: the focus delay before focus starts.
    tooltipFollowsMouse: true, // boolean: true if the gutter tooltip should follow mouse
    
    // session options
    firstLineNumber: 1, // number: the line number in first line
    overwrite: false, // boolean
    newLineMode: 'auto', // "auto" | "unix" | "windows"
    useWorker: true, // boolean: true if use web worker for loading scripts
    useSoftTabs: true, // boolean: true if we want to use spaces than tabs
    tabSize: 4, // number
    wrap: false, // boolean | string | number: true/'free' means wrap instead of horizontal scroll, false/'off' means horizontal scroll instead of wrap, and number means number of column before wrap. -1 means wrap at print margin
    indentedSoftWrap: true, // boolean
    foldStyle: 'markbegin', // enum: 'manual'/'markbegin'/'markbeginend'.
    mode: 'ace/mode/html' // string: path to language mode 
});















const vue_ace_editor = {
    
    render: function (h) {
        var height = this.height ? this.px(this.height) : '100%'
        var width = this.width ? this.px(this.width) : '100%'
        return h('div',{
            attrs: {
                style: "height: " + height  + '; width: ' + width,
            }
        })
    },
    
    props:{
        value:String,
        lang:true,
        theme:String,
        height:true,
        width:true,
        options:Object
    },
    
    data: function () {
        return {
            editor:null,
            contentBackup:""
        }
    },
    methods: {
        px:function (n) {
            if( /^\d*$/.test(n) ){
                return n+"px";
            }
            return n;
        }
    },
    watch:{
        value:function (val) {
            if(this.contentBackup !== val){
                this.editor.session.setValue(val,1);
                this.contentBackup = val;
            }
        },
        theme:function (newTheme) {
            this.editor.setTheme('ace/theme/'+newTheme);
        },
        lang:function (newLang) {
            this.editor.getSession().setMode(typeof newLang === 'string' ? ( 'ace/mode/' + newLang ) : newLang);
        },
        options:function(newOption){
            this.editor.setOptions(newOption);
        },
        height:function(){
            this.$nextTick(function(){
                this.editor.resize()
            })
        },
        width:function(){
            this.$nextTick(function(){
                this.editor.resize()
            })
        }
    },
    beforeDestroy: function() {
        this.editor.destroy();
        this.editor.container.remove();
    },
    mounted: function () {
        var vm = this;
        var lang = this.lang||'text';
        var theme = this.theme||'chrome';

        require('brace/ext/emmet');

        var editor = vm.editor = ace.edit(this.$el);
        editor.$blockScrolling = Infinity;

        this.$emit('init',editor);
        
        //editor.setOption("enableEmmet", true);
        editor.getSession().setMode(typeof lang === 'string' ? ( 'ace/mode/' + lang ) : lang);
        editor.setTheme('ace/theme/'+theme);
        if(this.value)
            editor.setValue(this.value,1);
        this.contentBackup = this.value;

        editor.on('change',function () {
            var content = editor.getValue();
            vm.$emit('input',content);
            vm.contentBackup = content;
        });
        if(vm.options)
            editor.setOptions(vm.options);
    }
}












const old_implementation = {
    
    template: `
        <ace-editor ref="oloEditor" class="vue-olo-editor" 
                v-model="content"
                @init="initEditor"
                lang="oloml"
                :options="editorOptions">
        </ace-editor>
    `,

    components: {
        //'ace-editor': require('vue2-ace-editor'),
    },
    
    props: ['value', 'theme'],

    data: () => Object({
        
        content: "",
        
        editorOptions: {
            fontSize: "12pt",
            //showLineNumbers: false,
            //showGutter: false
        }
    }),
    
    watch: {
        'value': function () {
            this.content = value;
        },
        'content': function () {
            this.$emit('input', this.content);
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





