
module.exports = {

    template: require("./olo-editor.html"),

    props: ['doc'],

    data: () => Object({
        editorOptions: {
            fontSize: "12pt",
            showLineNumbers: false,
            showGutter: false
        }
    }),

    components: {
        'ace-editor': require('vue2-ace-editor'),
    },
    
    methods: {
        initEditor () {
            require('brace/ext/language_tools') //language extension prerequsite...
            require('brace/mode/html')
            require('brace/theme/chrome')
        }
    }
}
