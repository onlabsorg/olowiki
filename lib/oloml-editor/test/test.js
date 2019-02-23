const chai = require("chai");

const olomlEditor = require("../src/index");
const Vue = require("vue/dist/vue.js");
const stripIndent = require("strip-indent");

const source = stripIndent(`
    x: 100
    test: 
        nil: null
        number: 10
        date: 2018-10-13
        bool: true
        sqrt: != $0^0.5
        template: !template |
            This is a template content: sqrt({{x}}) = {{this.sqrt(x)}}.
        markdown: !markdown |
            # Markdown content 
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim 
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut 
            aliquip ex ea commodo consequat.
            # Inline expressions
            * sqrt({{x}}) = {{this.sqrt(x)}}
        list:
            - Item 1
            - Item 2
            - Item 3
    index: |
        <h1>Document index</h1>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim 
        ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut 
        aliquip ex ea commodo consequat.
    `);


document.addEventListener("DOMContentLoaded", () => {
    window.vue = new Vue({        
        el: "#test",
        data: {
            source: source,
        },
        components: { 
            'oloml-editor': olomlEditor
        },
        methods: {
            logSource () {
                console.log(this.source);
            }
        }
    });
});
