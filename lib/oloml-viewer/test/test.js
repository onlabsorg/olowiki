const chai = require("chai");

const OloMLViewer = require("../src/index");
const Vue = require("vue/dist/vue.js");
const stripIndent = require("strip-indent");

const context = {};
const allowedTags = {
    '*': [ 'http:', 'https:', 'ftp:', 'mailto:', 'class', 'style', 'id', 'slot' ],

    // headers
    'h1': [],
    'h2': [],
    'h3': [],
    'h4': [],
    'h5': [],
    'h6': [],

    // lists
    'ul': [],
    'ol': [ 'type', 'start' ],
    'li': [],
    'dl': [],
    'dt': [],
    'dd': [],

    // tables
    'table': [],
    'thead': [],
    'tbody': [],
    'tfoot': [],
    'caption': [],
    'col': [],
    'colgroup': [],
    'tr': [],
    'th': [],
    'td': [],

    // misc block tags
    'p': [],
    'blockquote': [],
    'pre': [],
    'div': [],
    'br': [ '<>' ],
    'hr': [ '<>' ],

    // inline tags
    'b': [],
    'i': [],
    'strong': [],
    'em': [],
    'code': [],
    'a': [ 'href', 'name', 'target' ],
    'img': [ 'src', 'alt', 'height', 'width' , '<>' , "http:"],   
    'span': [],     
};


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
    index: Select a view from the menu.
    `);


document.addEventListener("DOMContentLoaded", () => {
    window.vue = new Vue({        
        el: "#test",
        data: {
            source: source,
            path: "index"
        },
        components: { 
            'oloml-viewer': OloMLViewer(context, allowedTags)
        }
    });
});
