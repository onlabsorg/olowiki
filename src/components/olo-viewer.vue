<template>
    <v-container class="olo-viewer" v-html="saneHTML"></v-container>
</template>

<script>
import DOMPurify from 'dompurify';
const DOMPURIFY_OPTIONS = {
    ADD_TAGS: ['style', 'polyline']
}

export default {
    name: "olo-viewer",
    
    props: ['html'],
    
    computed: {
        
        saneHTML () {
            return DOMPurify.sanitize(this.html, DOMPURIFY_OPTIONS);
        },
    }
}
</script>

<style>

    /*** GENERAL STYLES *******************************************************/
    
    .olo-viewer {
        --text-color: #212121;
        --text-light-color: #6A737D;
        --text-dark-color: #000000;
        --text-accent-color: #FFEBEE;
        
        --background-color: #ECEEF1;
        --background-light-color: #FFFFFF;
        --background-dark-color: #CFD8DC;
        --background-accent-color: #B71C1C;
        
        --link-color: #0366d6;
        
        --border-light-color: #dfe2e5;
    }

    .olo-viewer {
        color: var(--text-color);
        font-family: Roboto, Helvetica, Arial, sans-serif;
        font-size: 18px;
        line-height: 1.5;
        word-wrap: break-word;
        background-color: var(--background-light-color);
        padding-top: 3em;
        padding-bottom: 2em;
        max-width: 100%;
        width: 66em;
    }

    .olo-viewer * {
        box-sizing: border-box;
    }


    /*** HEADERS **************************************************************/

    .olo-viewer h1,
    .olo-viewer h2,
    .olo-viewer h3,
    .olo-viewer h4,
    .olo-viewer h5,
    .olo-viewer h6 {
        font-weight: 600;
    }

    .olo-viewer h1 {
        font-size: 2.5em;
        line-height: 1.2;
        margin-top: 1.2em;
        margin-bottom: 0.6em;
        text-align: center;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: var(--border-light-color);
    }

    .olo-viewer h2 {
        font-size: 1.8em;
        line-height: 1.6667;
        margin-top: 1.6667em;
        margin-bottom: 0.8333em;
    }

    .olo-viewer h3 {
        font-size: 1.6em;
        line-height: 1.875;
        margin-top: 1.875em;
        margin-bottom: 0.9375em;
    }

    .olo-viewer h4 {
        font-size: 1.4em;
        line-height: 1.0714;
        margin-top: 2.1429em;
        margin-bottom: 1.0714em;
    }

    .olo-viewer h5 {
        font-size: 1.2em;
        line-height: 1.25;
        margin-top: 2.5em;
        margin-bottom: 1.25em;
    }

    .olo-viewer h6 {
        font-size: 1em;
        line-height: 1.5;
        margin-top: 3em;
        margin-bottom: 1.5em;
    }


    /*** PARAGRAPH ************************************************************/

    .olo-viewer p {
        line-height: 1.5;
        margin-top: 1.5em;
        margin-bottom: 1.5em;
    }


    /*** ANCHORS **************************************************************/

    .olo-viewer a {
        background-color: initial;
        color: var(--link-color);
        text-decoration: none;
    }

    .olo-viewer a:active,
    .olo-viewer a:hover {
        outline-width: 0;
    }

    .olo-viewer a:hover {
        text-decoration: underline;
    }

    .olo-viewer a:not([href]) {
        color: inherit;
        text-decoration: none;
    }


    /*** DETAILS AND SUMMARY **************************************************/

    .olo-viewer details {
        display: block;
    }

    .olo-viewer summary {
        display: list-item;
    }

    .olo-viewer details summary {
        cursor: pointer;
    }


    /*** STRONG ***************************************************************/

    .olo-viewer strong {
        font-weight: inherit;
        font-weight: 600;
    }


    /*** CODE *****************************************************************/

    .olo-viewer code,
    .olo-viewer kbd,
    .olo-viewer pre {
        font-family: Consolas, "Lucida Console", monospace;
    }

    .olo-viewer kbd {
        display: inline-block;
        font-size: 1em;
        font-variant: small-caps;
        font-weight: 600;
        letter-spacing: 1px;
        line-height: 1.5;
        color: var(--text-color) !important;
        background-color: var(--background-color) !important;
        padding: 0 0.5em;
        border-radius: 0.25em;
        box-shadow: 1px 1px 1px #707070;
        margin: 0px 0.25em;
    }
    
    .olo-viewer code {
        font-size: 1em;
        font-weight: 600;
        line-height: 1.2;
        color: var(--text-color) !important;
        background-color: var(--background-color) !important;
        padding: .1em 0;
        border-radius: 0.25em;
        margin: .15em 0;
    }
    
    .olo-viewer pre {
        font-size: 1em;
        line-height: 1.5;
        word-wrap: normal;
        color: var(--text-color) !important;
        background-color: var(--background-color) !important;
        padding: 1.5em 4.5em;
        border-radius: 1em;
        margin: 1.5em 0;
        overflow: auto;
    }

    .olo-viewer pre.accent,
    .olo-viewer pre.accent code {
        background-color: var(--background-accent-color) !important;
        color: var(--text-accent-color) !important;
    }


    /*** BLOCKQUOTE ***********************************************************/

    .olo-viewer blockquote {
        font-size: 1em;
        font-style: italic;
        color: var(--text-light-color);
        line-height: 1.5;
        padding: 0 1.5em;
        border-left-width: .25em; 
        border-left-style: solid; 
        border-left-color: var(--border-light-color);
        border-right-width: .25em; 
        border-right-style: solid; 
        border-right-color: var(--border-light-color);
        border-radius: 1em;
        margin: 1.5em 3em;
    }


    /*** TABLES ***************************************************************/

    .olo-viewer table {
        display: table;
        width: 100%;
        overflow: auto;
        border-spacing: 0;
        border-collapse: collapse;
        border-color: var(--border-light-color);
        font-size: 1em;
        margin: 1.5em 0;
    }

    .olo-viewer td,
    .olo-viewer th {
        font-size: 1em;
        line-height: 1.5;
        padding: 0.75em 1.5em;
        border-width: 1px;
        border-style: solid;
        border-color: var(--border-light-color);
    }

    .olo-viewer table th {
        font-weight: 600;
        background-color: var(--background-dark-color);
    }

    .olo-viewer table td {
        background-color: var(--background-light-color);
    }


    /*** LISTS ****************************************************************/

    .olo-viewer ol,
    .olo-viewer ul {
        font-size: 1em;
        line-height: 1.5;
        padding: 0 0 0 1.5em;
        margin: 1.5em 0;
    }

    .olo-viewer ul {
        list-style-type: square;
    }

    .olo-viewer ol {
        list-style-type: decimal;
    }

    .olo-viewer ol ol,
    .olo-viewer ol ul,
    .olo-viewer ul ol,
    .olo-viewer ul ul {
        margin: 0;
    }

    .olo-viewer li {
        word-wrap: break-all;
    }


    /*** LINE BREAK ***********************************************************/

    .olo-viewer hr {
        font-size: 1em;
        box-sizing: initial;
        overflow: hidden;
        height: 0;
        background-color: transparent;
        margin: 3em 0;
        border: 0;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: var(--border-light-color);
    }


    /*** IMAGES ***************************************************************/

    .olo-viewer img {
        display: block;
        font-size: 1em;
        border-style: none;
        margin: 1.5em auto;
        max-width: 100%;
        box-sizing: initial;
        border-radius: 1em;
    }
</style>
