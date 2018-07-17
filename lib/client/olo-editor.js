

module.exports = {

    template: require("./olo-editor.html"),

    props: ['content'],

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
            require('brace/ext/language_tools'); //language extension prerequsite...
            require('brace/mode/html');
            require('brace/mode/markdown');
            require('brace/mode/yaml');
            require('brace/theme/chrome')
        }
    }
}
