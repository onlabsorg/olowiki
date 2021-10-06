<template>
    <v-container class="olo-viewer" v-html="saneHTML"></v-container>
</template>

<script>
import DOMPurify from 'dompurify';

export default {
    name: "olo-viewer",
    
    props: ['html'],
    
    computed: {
        
        saneHTML () {
            return DOMPurify.sanitize(this.html);
        },
    }
}
</script>

<style>

    .olo-viewer {
        padding: 3em;
    }

    .olo-viewer .octicon {
      display: inline-block;
      fill: currentColor;
      vertical-align: text-bottom;
    }

    .olo-viewer .anchor {
      float: left;
      line-height: 1;
      margin-left: -20px;
      padding-right: 4px;
    }

    .olo-viewer .anchor:focus {
      outline: none;
    }

    .olo-viewer h1 .octicon-link,
    .olo-viewer h2 .octicon-link,
    .olo-viewer h3 .octicon-link,
    .olo-viewer h4 .octicon-link,
    .olo-viewer h5 .octicon-link,
    .olo-viewer h6 .octicon-link {
      color: #1b1f23;
      vertical-align: middle;
      visibility: hidden;
    }

    .olo-viewer h1:hover .anchor,
    .olo-viewer h2:hover .anchor,
    .olo-viewer h3:hover .anchor,
    .olo-viewer h4:hover .anchor,
    .olo-viewer h5:hover .anchor,
    .olo-viewer h6:hover .anchor {
      text-decoration: none;
    }

    .olo-viewer h1:hover .anchor .octicon-link,
    .olo-viewer h2:hover .anchor .octicon-link,
    .olo-viewer h3:hover .anchor .octicon-link,
    .olo-viewer h4:hover .anchor .octicon-link,
    .olo-viewer h5:hover .anchor .octicon-link,
    .olo-viewer h6:hover .anchor .octicon-link {
      visibility: visible;
    }

    .olo-viewer h1:hover .anchor .octicon-link:before,
    .olo-viewer h2:hover .anchor .octicon-link:before,
    .olo-viewer h3:hover .anchor .octicon-link:before,
    .olo-viewer h4:hover .anchor .octicon-link:before,
    .olo-viewer h5:hover .anchor .octicon-link:before,
    .olo-viewer h6:hover .anchor .octicon-link:before {
      width: 16px;
      height: 16px;
      content: ' ';
      display: inline-block;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' version='1.1' width='16' height='16' aria-hidden='true'%3E%3Cpath fill-rule='evenodd' d='M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z'%3E%3C/path%3E%3C/svg%3E");
    }.olo-viewer {
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
      line-height: 1.5;
      color: #24292e;
      font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji;
      font-size: 16px;
      line-height: 1.5;
      word-wrap: break-word;
    }

    .olo-viewer details {
      display: block;
    }

    .olo-viewer summary {
      display: list-item;
    }

    .olo-viewer a {
      background-color: initial;
    }

    .olo-viewer a:active,
    .olo-viewer a:hover {
      outline-width: 0;
    }

    .olo-viewer strong {
      font-weight: inherit;
      font-weight: bolder;
    }

    .olo-viewer h1 {
      font-size: 2em;
      margin: .67em 0;
    }

    .olo-viewer img {
      border-style: none;
    }

    .olo-viewer code,
    .olo-viewer kbd,
    .olo-viewer pre {
      font-family: monospace,monospace;
      font-size: 1em;
    }

    .olo-viewer hr {
      box-sizing: initial;
      height: 0;
      overflow: visible;
    }

    .olo-viewer input {
      font: inherit;
      margin: 0;
    }

    .olo-viewer input {
      overflow: visible;
    }

    .olo-viewer [type=checkbox] {
      box-sizing: border-box;
      padding: 0;
    }

    .olo-viewer * {
      box-sizing: border-box;
    }

    .olo-viewer input {
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
    }

    .olo-viewer a {
      color: #0366d6;
      text-decoration: none;
    }

    .olo-viewer a:hover {
      text-decoration: underline;
    }

    .olo-viewer strong {
      font-weight: 600;
    }

    .olo-viewer hr {
      height: 0;
      margin: 15px 0;
      overflow: hidden;
      background: transparent;
      border: 0;
      border-bottom: 1px solid #dfe2e5;
    }

    .olo-viewer hr:after,
    .olo-viewer hr:before {
      display: table;
      content: "";
    }

    .olo-viewer hr:after {
      clear: both;
    }

    .olo-viewer table {
      border-spacing: 0;
      border-collapse: collapse;
    }

    .olo-viewer td,
    .olo-viewer th {
      padding: 0;
    }

    .olo-viewer details summary {
      cursor: pointer;
    }

    .olo-viewer kbd {
      display: inline-block;
      padding: 3px 5px;
      font: 11px SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
      line-height: 10px;
      color: #444d56;
      vertical-align: middle;
      background-color: #fafbfc;
      border: 1px solid #d1d5da;
      border-radius: 3px;
      box-shadow: inset 0 -1px 0 #d1d5da;
    }

    .olo-viewer h1,
    .olo-viewer h2,
    .olo-viewer h3,
    .olo-viewer h4,
    .olo-viewer h5,
    .olo-viewer h6 {
      margin-top: 0;
      margin-bottom: 0;
    }

    .olo-viewer h1 {
      font-size: 32px;
    }

    .olo-viewer h1,
    .olo-viewer h2 {
      font-weight: 600;
    }

    .olo-viewer h2 {
      font-size: 24px;
    }

    .olo-viewer h3 {
      font-size: 20px;
    }

    .olo-viewer h3,
    .olo-viewer h4 {
      font-weight: 600;
    }

    .olo-viewer h4 {
      font-size: 16px;
    }

    .olo-viewer h5 {
      font-size: 14px;
    }

    .olo-viewer h5,
    .olo-viewer h6 {
      font-weight: 600;
    }

    .olo-viewer h6 {
      font-size: 12px;
    }

    .olo-viewer p {
      margin-top: 0;
      margin-bottom: 10px;
    }

    .olo-viewer blockquote {
      margin: 0;
    }

    .olo-viewer ol,
    .olo-viewer ul {
      padding-left: 0;
      margin-top: 0;
      margin-bottom: 0;
    }

    .olo-viewer ol ol,
    .olo-viewer ul ol {
      list-style-type: lower-roman;
    }

    .olo-viewer ol ol ol,
    .olo-viewer ol ul ol,
    .olo-viewer ul ol ol,
    .olo-viewer ul ul ol {
      list-style-type: lower-alpha;
    }

    .olo-viewer dd {
      margin-left: 0;
    }

    .olo-viewer code,
    .olo-viewer pre {
      font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
      font-size: 12px;
    }

    .olo-viewer pre {
      margin-top: 0;
      margin-bottom: 0;
    }

    .olo-viewer input::-webkit-inner-spin-button,
    .olo-viewer input::-webkit-outer-spin-button {
      margin: 0;
      -webkit-appearance: none;
      appearance: none;
    }

    .olo-viewer :checked+.radio-label {
      position: relative;
      z-index: 1;
      border-color: #0366d6;
    }

    .olo-viewer .border {
      border: 1px solid #e1e4e8!important;
    }

    .olo-viewer .border-0 {
      border: 0!important;
    }

    .olo-viewer .border-bottom {
      border-bottom: 1px solid #e1e4e8!important;
    }

    .olo-viewer .rounded-1 {
      border-radius: 3px!important;
    }

    .olo-viewer .bg-white {
      background-color: #fff!important;
    }

    .olo-viewer .bg-gray-light {
      background-color: #fafbfc!important;
    }

    .olo-viewer .text-gray-light {
      color: #6a737d!important;
    }

    .olo-viewer .mb-0 {
      margin-bottom: 0!important;
    }

    .olo-viewer .my-2 {
      margin-top: 8px!important;
      margin-bottom: 8px!important;
    }

    .olo-viewer .pl-0 {
      padding-left: 0!important;
    }

    .olo-viewer .py-0 {
      padding-top: 0!important;
      padding-bottom: 0!important;
    }

    .olo-viewer .pl-1 {
      padding-left: 4px!important;
    }

    .olo-viewer .pl-2 {
      padding-left: 8px!important;
    }

    .olo-viewer .py-2 {
      padding-top: 8px!important;
      padding-bottom: 8px!important;
    }

    .olo-viewer .pl-3,
    .olo-viewer .px-3 {
      padding-left: 16px!important;
    }

    .olo-viewer .px-3 {
      padding-right: 16px!important;
    }

    .olo-viewer .pl-4 {
      padding-left: 24px!important;
    }

    .olo-viewer .pl-5 {
      padding-left: 32px!important;
    }

    .olo-viewer .pl-6 {
      padding-left: 40px!important;
    }

    .olo-viewer .f6 {
      font-size: 12px!important;
    }

    .olo-viewer .lh-condensed {
      line-height: 1.25!important;
    }

    .olo-viewer .text-bold {
      font-weight: 600!important;
    }

    .olo-viewer .pl-c {
      color: #6a737d;
    }

    .olo-viewer .pl-c1,
    .olo-viewer .pl-s .pl-v {
      color: #005cc5;
    }

    .olo-viewer .pl-e,
    .olo-viewer .pl-en {
      color: #6f42c1;
    }

    .olo-viewer .pl-s .pl-s1,
    .olo-viewer .pl-smi {
      color: #24292e;
    }

    .olo-viewer .pl-ent {
      color: #22863a;
    }

    .olo-viewer .pl-k {
      color: #d73a49;
    }

    .olo-viewer .pl-pds,
    .olo-viewer .pl-s,
    .olo-viewer .pl-s .pl-pse .pl-s1,
    .olo-viewer .pl-sr,
    .olo-viewer .pl-sr .pl-cce,
    .olo-viewer .pl-sr .pl-sra,
    .olo-viewer .pl-sr .pl-sre {
      color: #032f62;
    }

    .olo-viewer .pl-smw,
    .olo-viewer .pl-v {
      color: #e36209;
    }

    .olo-viewer .pl-bu {
      color: #b31d28;
    }

    .olo-viewer .pl-ii {
      color: #fafbfc;
      background-color: #b31d28;
    }

    .olo-viewer .pl-c2 {
      color: #fafbfc;
      background-color: #d73a49;
    }

    .olo-viewer .pl-c2:before {
      content: "^M";
    }

    .olo-viewer .pl-sr .pl-cce {
      font-weight: 700;
      color: #22863a;
    }

    .olo-viewer .pl-ml {
      color: #735c0f;
    }

    .olo-viewer .pl-mh,
    .olo-viewer .pl-mh .pl-en,
    .olo-viewer .pl-ms {
      font-weight: 700;
      color: #005cc5;
    }

    .olo-viewer .pl-mi {
      font-style: italic;
      color: #24292e;
    }

    .olo-viewer .pl-mb {
      font-weight: 700;
      color: #24292e;
    }

    .olo-viewer .pl-md {
      color: #b31d28;
      background-color: #ffeef0;
    }

    .olo-viewer .pl-mi1 {
      color: #22863a;
      background-color: #f0fff4;
    }

    .olo-viewer .pl-mc {
      color: #e36209;
      background-color: #ffebda;
    }

    .olo-viewer .pl-mi2 {
      color: #f6f8fa;
      background-color: #005cc5;
    }

    .olo-viewer .pl-mdr {
      font-weight: 700;
      color: #6f42c1;
    }

    .olo-viewer .pl-ba {
      color: #586069;
    }

    .olo-viewer .pl-sg {
      color: #959da5;
    }

    .olo-viewer .pl-corl {
      text-decoration: underline;
      color: #032f62;
    }

    .olo-viewer .mb-0 {
      margin-bottom: 0!important;
    }

    .olo-viewer .my-2 {
      margin-bottom: 8px!important;
    }

    .olo-viewer .my-2 {
      margin-top: 8px!important;
    }

    .olo-viewer .pl-0 {
      padding-left: 0!important;
    }

    .olo-viewer .py-0 {
      padding-top: 0!important;
      padding-bottom: 0!important;
    }

    .olo-viewer .pl-1 {
      padding-left: 4px!important;
    }

    .olo-viewer .pl-2 {
      padding-left: 8px!important;
    }

    .olo-viewer .py-2 {
      padding-top: 8px!important;
      padding-bottom: 8px!important;
    }

    .olo-viewer .pl-3 {
      padding-left: 16px!important;
    }

    .olo-viewer .pl-4 {
      padding-left: 24px!important;
    }

    .olo-viewer .pl-5 {
      padding-left: 32px!important;
    }

    .olo-viewer .pl-6 {
      padding-left: 40px!important;
    }

    .olo-viewer .pl-7 {
      padding-left: 48px!important;
    }

    .olo-viewer .pl-8 {
      padding-left: 64px!important;
    }

    .olo-viewer .pl-9 {
      padding-left: 80px!important;
    }

    .olo-viewer .pl-10 {
      padding-left: 96px!important;
    }

    .olo-viewer .pl-11 {
      padding-left: 112px!important;
    }

    .olo-viewer .pl-12 {
      padding-left: 128px!important;
    }

    .olo-viewer hr {
      border-bottom-color: #eee;
    }

    .olo-viewer kbd {
      display: inline-block;
      padding: 3px 5px;
      font: 11px SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
      line-height: 10px;
      color: #444d56;
      vertical-align: middle;
      background-color: #fafbfc;
      border: 1px solid #d1d5da;
      border-radius: 3px;
      box-shadow: inset 0 -1px 0 #d1d5da;
    }

    .olo-viewer:after,
    .olo-viewer:before {
      display: table;
      content: "";
    }

    .olo-viewer:after {
      clear: both;
    }

    .olo-viewer>:first-child {
      margin-top: 0!important;
    }

    .olo-viewer>:last-child {
      margin-bottom: 0!important;
    }

    .olo-viewer a:not([href]) {
      color: inherit;
      text-decoration: none;
    }

    .olo-viewer blockquote,
    .olo-viewer details,
    .olo-viewer dl,
    .olo-viewer ol,
    .olo-viewer p,
    .olo-viewer pre,
    .olo-viewer table,
    .olo-viewer ul {
      margin-top: 0;
      margin-bottom: 16px;
    }

    .olo-viewer hr {
      height: .25em;
      padding: 0;
      margin: 24px 0;
      background-color: #e1e4e8;
      border: 0;
    }

    .olo-viewer blockquote {
      padding: 0 1em;
      color: #6a737d;
      border-left: .25em solid #dfe2e5;
    }

    .olo-viewer blockquote>:first-child {
      margin-top: 0;
    }

    .olo-viewer blockquote>:last-child {
      margin-bottom: 0;
    }

    .olo-viewer h1,
    .olo-viewer h2,
    .olo-viewer h3,
    .olo-viewer h4,
    .olo-viewer h5,
    .olo-viewer h6 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
    }

    .olo-viewer h1 {
      font-size: 2em;
    }

    .olo-viewer h1,
    .olo-viewer h2 {
      padding-bottom: .3em;
      border-bottom: 1px solid #eaecef;
    }

    .olo-viewer h2 {
      font-size: 1.5em;
    }

    .olo-viewer h3 {
      font-size: 1.25em;
    }

    .olo-viewer h4 {
      font-size: 1em;
    }

    .olo-viewer h5 {
      font-size: .875em;
    }

    .olo-viewer h6 {
      font-size: .85em;
      color: #6a737d;
    }

    .olo-viewer ol,
    .olo-viewer ul {
      padding-left: 2em;
    }

    .olo-viewer ol ol,
    .olo-viewer ol ul,
    .olo-viewer ul ol,
    .olo-viewer ul ul {
      margin-top: 0;
      margin-bottom: 0;
    }

    .olo-viewer li {
      word-wrap: break-all;
    }

    .olo-viewer li>p {
      margin-top: 16px;
    }

    .olo-viewer li+li {
      margin-top: .25em;
    }

    .olo-viewer dl {
      padding: 0;
    }

    .olo-viewer dl dt {
      padding: 0;
      margin-top: 16px;
      font-size: 1em;
      font-style: italic;
      font-weight: 600;
    }

    .olo-viewer dl dd {
      padding: 0 16px;
      margin-bottom: 16px;
    }

    .olo-viewer table {
      display: block;
      width: 100%;
      overflow: auto;
    }

    .olo-viewer table th {
      font-weight: 600;
    }

    .olo-viewer table td,
    .olo-viewer table th {
      padding: 6px 13px;
      border: 1px solid #dfe2e5;
    }

    .olo-viewer table tr {
      background-color: #fff;
      border-top: 1px solid #c6cbd1;
    }

    .olo-viewer table tr:nth-child(2n) {
      background-color: #f6f8fa;
    }

    .olo-viewer img {
      max-width: 100%;
      box-sizing: initial;
      background-color: #fff;
    }

    .olo-viewer img[align=right] {
      padding-left: 20px;
    }

    .olo-viewer img[align=left] {
      padding-right: 20px;
    }

    .olo-viewer code {
      padding: .2em .4em;
      margin: 0;
      font-size: 85%;
      background-color: rgba(27,31,35,.05);
      border-radius: 3px;
    }

    .olo-viewer pre {
      word-wrap: normal;
    }

    .olo-viewer pre>code {
      padding: 0;
      margin: 0;
      font-size: 100%;
      word-break: normal;
      white-space: pre;
      background: transparent;
      border: 0;
    }

    .olo-viewer .highlight {
      margin-bottom: 16px;
    }

    .olo-viewer .highlight pre {
      margin-bottom: 0;
      word-break: normal;
    }

    .olo-viewer .highlight pre,
    .olo-viewer pre {
      padding: 16px;
      overflow: auto;
      font-size: 85%;
      line-height: 1.45;
      background-color: #f6f8fa;
      border-radius: 3px;
    }

    .olo-viewer pre code {
      display: inline;
      max-width: auto;
      padding: 0;
      margin: 0;
      overflow: visible;
      line-height: inherit;
      word-wrap: normal;
      background-color: initial;
      border: 0;
    }

    .olo-viewer .commit-tease-sha {
      display: inline-block;
      font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
      font-size: 90%;
      color: #444d56;
    }

    .olo-viewer .full-commit .btn-outline:not(:disabled):hover {
      color: #005cc5;
      border-color: #005cc5;
    }

    .olo-viewer .blob-wrapper {
      overflow-x: auto;
      overflow-y: hidden;
    }

    .olo-viewer .blob-wrapper-embedded {
      max-height: 240px;
      overflow-y: auto;
    }

    .olo-viewer .blob-num {
      width: 1%;
      min-width: 50px;
      padding-right: 10px;
      padding-left: 10px;
      font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
      font-size: 12px;
      line-height: 20px;
      color: rgba(27,31,35,.3);
      text-align: right;
      white-space: nowrap;
      vertical-align: top;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    .olo-viewer .blob-num:hover {
      color: rgba(27,31,35,.6);
    }

    .olo-viewer .blob-num:before {
      content: attr(data-line-number);
    }

    .olo-viewer .blob-code {
      position: relative;
      padding-right: 10px;
      padding-left: 10px;
      line-height: 20px;
      vertical-align: top;
    }

    .olo-viewer .blob-code-inner {
      overflow: visible;
      font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
      font-size: 12px;
      color: #24292e;
      word-wrap: normal;
      white-space: pre;
    }

    .olo-viewer .pl-token.active,
    .olo-viewer .pl-token:hover {
      cursor: pointer;
      background: #ffea7f;
    }

    .olo-viewer .tab-size[data-tab-size="1"] {
      -moz-tab-size: 1;
      tab-size: 1;
    }

    .olo-viewer .tab-size[data-tab-size="2"] {
      -moz-tab-size: 2;
      tab-size: 2;
    }

    .olo-viewer .tab-size[data-tab-size="3"] {
      -moz-tab-size: 3;
      tab-size: 3;
    }

    .olo-viewer .tab-size[data-tab-size="4"] {
      -moz-tab-size: 4;
      tab-size: 4;
    }

    .olo-viewer .tab-size[data-tab-size="5"] {
      -moz-tab-size: 5;
      tab-size: 5;
    }

    .olo-viewer .tab-size[data-tab-size="6"] {
      -moz-tab-size: 6;
      tab-size: 6;
    }

    .olo-viewer .tab-size[data-tab-size="7"] {
      -moz-tab-size: 7;
      tab-size: 7;
    }

    .olo-viewer .tab-size[data-tab-size="8"] {
      -moz-tab-size: 8;
      tab-size: 8;
    }

    .olo-viewer .tab-size[data-tab-size="9"] {
      -moz-tab-size: 9;
      tab-size: 9;
    }

    .olo-viewer .tab-size[data-tab-size="10"] {
      -moz-tab-size: 10;
      tab-size: 10;
    }

    .olo-viewer .tab-size[data-tab-size="11"] {
      -moz-tab-size: 11;
      tab-size: 11;
    }

    .olo-viewer .tab-size[data-tab-size="12"] {
      -moz-tab-size: 12;
      tab-size: 12;
    }

    .olo-viewer .task-list-item {
      list-style-type: none;
    }

    .olo-viewer .task-list-item+.task-list-item {
      margin-top: 3px;
    }

    .olo-viewer .task-list-item input {
      margin: 0 .2em .25em -1.6em;
      vertical-align: middle;
    }

</style>