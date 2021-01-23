<template>
    <div ref="app" class="olowiki-app">

        <md-app>

            <md-app-toolbar class="md-transparent" md-elevation="3">

                <md-button class="md-icon-button olo-logo" @click="$emit('logo-click')">
                    <md-icon md-src="olowiki.svg" />
                </md-button>

                <span class="md-title olo-title">{{title}}</span>

                <div class="olo-controls">
                    <slot name="button"></slot>
                </div>

            </md-app-toolbar>

            <md-app-drawer md-permanent="clipped" v-if="showMenu">
                <slot name="drawer-item"></slot>
            </md-app-drawer>

            <md-app-content>
                <slot name="content"></slot>
            </md-app-content>
        </md-app>

        <md-snackbar md-position="center" :md-duration="message.duration" :md-active.sync="message.show" md-persistent>
            <span>{{message.content}}</span>
            <md-button class="md-primary" @click="message.show = false">Close</md-button>
        </md-snackbar>
    </div>
</template>

<script>

    const Vue = require("vue/dist/vue");

    Vue.use( require('vue-async-computed').default )

    Vue.use( require("vue-material/dist/components/MdApp").default );
    Vue.use( require("vue-material/dist/components/MdSubheader").default );
    Vue.use( require("vue-material/dist/components/MdToolbar").default );
    Vue.use( require("vue-material/dist/components/MdContent").default );
    Vue.use( require("vue-material/dist/components/MdButton").default );
    Vue.use( require("vue-material/dist/components/MdIcon").default );
    Vue.use( require("vue-material/dist/components/MdField").default );
    Vue.use( require("vue-material/dist/components/MdSnackbar").default );
    Vue.use( require("vue-material/dist/components/MdDrawer").default );

    require('vue-material/dist/vue-material.css');
    require('vue-material/dist/theme/default.css');

    const detectKeyString = require("key-string").detectKeyString;

    module.exports = {

        // components: {},

        props: ['appname', 'title'],

        data: () => Object({
            message: {
                show: false,
                content: "",
                duration: 3000
            },
            showMenu: true,
        }),

        // asyncComputed: {},

        // computed: {},

        // watch: {},

        methods: {

            showMessage (content) {
                this.message.content = content;
                this.message.show = true;
            },
        },

        mounted () {
            this.$parent.$on('message', content => this.showMessage(content));
            document.body.addEventListener("keydown", event => {
                event.keyString = detectKeyString(event);
                this.$emit("key", event);
            }, true);
        }
    };
</script>

<style>
    @font-face {
      font-family: 'Material Icons';
      font-style: normal;
      font-weight: 400;
      src: local('Material Icons'),
        local('MaterialIcons-Regular'),
        url("./material-icons-font/MaterialIcons-Regular.woff2") format('woff2');
    }

    @font-face {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 400;
      src: url("./roboto-font/Roboto-Regular.ttf") format('truetype');
    }


    body {
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
      line-height: 1.5;
      color: #24292e;
      font-family: "Roboto", Helvetica, Arial, sans-serif;
      font-size: 16px;
      line-height: 1.5;
      word-wrap: break-word;
    }


    .olowiki-app .md-app {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }

    .olowiki-app .md-app-toolbar,
    .olowiki-app .md-toolbar {
        display: flex;
        flex-wrap: nowrap;
        border-bottom: 1px solid var(--md-theme-default-divider, rgba(0,0,0,0.12));
    }

    .olowiki-app .md-app-toolbar .olo-logo {}

    .olowiki-app .md-app-toolbar .olo-title {
        flex: 1 1 auto;
        text-align: center;
    }

    .olowiki-app .md-app-toolbar .olo-controls {
        flex: 0 0 auto;
    }

    .olowiki-app .md-app-drawer {
        border-right: 1px solid var(--md-theme-default-divider, rgba(0,0,0,0.12));
        width: 25%;
        max-width: calc(100vw - 125px);
    }

    .olowiki-app .md-app-content {
        padding: 0;
        margin: 0;
        border: 0;
    }

    .olowiki-app #settings {
        padding: 1em 10%;
    }

    .olowiki-app .footer {
        font-size: 0.8em;
        text-align: center;
        color: rgba(21, 21, 21, 0.5);
        padding: 1em;
    }

    .olowiki-app .footer p {
        margin: 0.4em 0 0.4em 0;
    }

    .olowiki-app #settings .footer p {
        padding: 0;
        margin: 0.2em;
    }

    .olowiki-app #settings .right {
        text-align: right;
    }

</style>
