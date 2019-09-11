<template>
    <olowiki-app class="olowiki-document" :title="title" @key="handleKeyboardCommand">
        
        <md-icon slot="logo" md-src="/olowiki.svg"></md-icon>


        <!-- view state -->
            
        <md-button slot="button" v-if="stateIs('view')" class="md-icon-button" @click="save">
            <md-icon>save</md-icon>
        </md-button>
            
        <md-button slot="button" v-if="stateIs('view')" class="md-icon-button" @click="setState('edit')">
            <md-icon>edit</md-icon>
        </md-button>    
        
        <olo-viewer slot="content" ref="viewer" v-if="stateIs('view')" :doc="doc" @rendered="onRender"></olo-viewer>            
        
        
        <!-- edit state -->
        
        <md-button slot="button" v-if="stateIs('edit')" class="md-icon-button control" @click="commit">
            <md-icon>done</md-icon>
        </md-button>

        <md-button slot="button" v-if="stateIs('edit')" class="md-icon-button control" @click="setState('view')">
            <md-icon>close</md-icon>
        </md-button>
                
        <olo-editor slot="content" ref="editor" v-if="stateIs('edit')" :doc="doc"></olo-editor>
        
        
        <!-- empty states -->
        
        <md-empty-state slot="content" v-if="stateIs('error')" md-icon="error" md-label="Error!" :md-description="errorMessage"></md-empty-state>
            
    </olowiki-app>
</template>

<script>
    const olojs = require("olojs");
    const client = require("../lib/client");

    const Vue = require("vue/dist/vue");
    Vue.use( require("vue-material/dist/components/MdSubheader").default );
    Vue.use( require("vue-material/dist/components/MdButton").default );
    Vue.use( require("vue-material/dist/components/MdIcon").default );
    Vue.use( require("vue-material/dist/components/MdEmptyState").default );

    module.exports = {
        
        components: {
            'olowiki-app': require("./app.vue").default,            
            'olo-viewer': require("olo-viewer"),
            'olo-editor': require("olo-editor")
        },
        
        props: ['href'],
        
        data: () => Object({
            title: "",
            state: "view",
            errorMessage: "",
        }),  
        
        computed: {
            
            url: function () {
                return new URL(this.href);
            }
        },
        
        asyncComputed: {
            
            doc: {
                default: client.createDocument(location.pathname, ""),
                get: async function () {
                    try {
                        const doc = await client.readDocument(this.url.pathname);
                        const docVal = await doc.evaluate();
                        return await client.readDocument(this.url.pathname);
                    } catch (error) {
                        console.error(error);
                        this.setState("error");
                        this.errorMessage = error.message;
                        return new client.createDocument(location.pathname, "");
                    }
                }
            }
        },
                
        methods: {
            
            onRender (docNS) {
                this.title = docNS.title || "Document without title"
            },
            
            async save () {
                try {
                    await client.writeDocument(this.doc);
                    this.showMessage("Saved");
                } catch (error) {
                    if (error instanceof olojs.errors.WriteAccessDenied) {
                        this.showMessage("Not saved: write access denied");
                    } else {
                        this.showMessage("Not saved: an error occurred while saving");
                    }
                }
            },
            
            commit () {
                this.$refs.editor.commit();
                this.setState("view");
            },
            
            showMessage (content) {
                this.$emit('message', content);
            },

            setState (state) {
                this.state = state;
            },
            
            stateIs (state) {
                return this.state === state;
            },
            
            stateIn (...states) {
                return states.indexOf(this.state) !== -1;
            },
            
            handleKeyboardCommand (event) {
                if (this.stateIs('view')) switch (event.keyString) {
                    
                    case "Ctrl+S":
                        event.preventDefault();
                        this.save();
                        break;
                        
                    case "Ctrl+Return":
                        this.setState('edit');
                        break;

                    case "Esc":
                        if (this.stateIs('edit')) {
                            this.setState('view');
                        }
                        break;
                    
                    default:
                        break;
                }

                else if (this.stateIs('edit')) switch (event.keyString) {
                    
                    case "Ctrl+S":
                        event.preventDefault();
                        this.$refs.editor.commit();
                        this.save();
                        break;
                        
                    case "Ctrl+Return":
                        this.commit();
                        break;

                    case "Esc":
                        this.setState('view');
                        break;
                    
                    default:
                        break;                        
                }
            }
        },
        
        //mounted () {}
    };
</script>

<style>
</style>
