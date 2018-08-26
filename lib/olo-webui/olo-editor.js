

module.exports = {

    template: require("./olo-editor.html"),

    components: {
        'ace-editor': require('vue2-ace-editor'),
    },
    
    props: ['value', 'lang'],

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
            set (value) {
                this.$emit('input', value);
            }
        }
    },
    
    methods: {
        
        initEditor () {
            require('brace/ext/language_tools'); //language extension prerequsite...
            require('brace/mode/yaml');
            require('brace/theme/chrome')
        }
    }
}
