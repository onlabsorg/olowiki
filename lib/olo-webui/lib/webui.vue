<template>
    <div class="olo-webui">

        <md-app md-waterfall md-mode="fixed">
            <md-app-content>
                <slot name="content"></slot>
            </md-app-content>
        </md-app>
        
        <md-speed-dial class="md-bottom-right" md-direction="top" md-event="click" md-effect="opacity">
            
            <md-speed-dial-target class="menu-button">
                <md-icon :md-src="logo"></md-icon>
            </md-speed-dial-target>
            
            <md-speed-dial-content>
                <slot name="menu-item"></slot>            
            </md-speed-dial-content>
            
        </md-speed-dial>

        <md-snackbar md-position="left" :md-duration="4000" :md-active.sync="message.show" md-persistent>
            <span>{{message.text}}</span>
            <md-button class="md-primary md-icon-button" @click="message.show = false">
                <md-icon>cancel</md-icon>
            </md-button>
        </md-snackbar>
        
        <slot></slot>    
    </div>
</template>

<script>
    const keyString = require("./utils/key-string");

    const Vue = require("vue/dist/vue");
    Vue.use( require("vue-material/dist/components/MdApp").default );
    Vue.use( require("vue-material/dist/components/MdToolbar").default );
    Vue.use( require("vue-material/dist/components/MdContent").default );
    Vue.use( require("vue-material/dist/components/MdButton").default );
    Vue.use( require("vue-material/dist/components/MdIcon").default );
    Vue.use( require("vue-material/dist/components/MdSpeedDial").default );
    Vue.use( require("vue-material/dist/components/MdSnackbar").default );

    require('vue-material/dist/vue-material.css');
    require('vue-material/dist/theme/default.css');

    module.exports = {
        props: ['message', 'logo'],
        data: () => Object({}),  
        mounted () {
            document.body.addEventListener('keydown', (event) => {
                this.$emit('key-command', keyString(event), event);
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
        url("../vendor/material-icons-font/MaterialIcons-Regular.woff2") format('woff2');
    }

    @font-face {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 400;
      src: url("../vendor/roboto-font/Roboto-Regular.ttf") format('truetype');
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


    .olo-webui .md-app {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }

    .olo-webui .md-app-toolbar {
        display: flex;
        flex-wrap: nowrap;
    }

    .olo-webui .md-app-toolbar .olo-logo {}

    .olo-webui .md-app-toolbar .olo-title {
        flex: 1 1 auto;
    }

    .olo-webui .md-app-toolbar .olo-controls slot {
        flex: 0 0 auto;
    }

    .olo-webui .md-app-content {
        padding: 0;
        margin: 0;
        border: 0;
    }
    
    .olo-webui div.md-speed-dial.md-theme-default > .menu-button {
        background-color: #FFFFFF;        
    }
</style>
