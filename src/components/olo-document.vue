<template>
    <v-card class="olo-document" elevation="1" rounded="lg">
        
        <olo-viewer
            v-if="mode == 'view'"
            :html="text"
            >
        </olo-viewer>
        
        <olo-editor 
            v-if="mode == 'edit'"
            v-model="editorContent"
            theme="idle_fingers"
            fontsize="14"
            >
        </olo-editor>
        
    </v-card>
</template>

<script>
    import Vue from 'vue';
    import AsyncComputed from 'vue-async-computed';
    Vue.use(AsyncComputed);

    export default {
        name: "olo-document",
        
        components: {
            'olo-viewer': () => import('./olo-viewer'),
            'olo-editor': () => import('./olo-editor'),
        },    
        
        props: ['store', 'path', 'mode', 'presets'],
        
        data: () => ({
            source: "",
            editorContent: "",
        }),
        
        computed: {
            
            context () {
                return this.store ? this.store.createContext(this.path, this.presets) : {};
            },
            
            evaluate () {
                return this.store.parse(this.source);
            },

            text () {
                return this.doc.text;
            },
            
            data () {
                return this.doc.data;
            }
        },
        
        asyncComputed: {
            
            fileContent: {
                
                async get () {
                    try {
                        return this.store.read(this.path);
                    } catch (error) {
                        return `<p><b>Failed to load ${this.path}</b></p>
                                <code><pre>${error.message}</pre></code>`
                    }
                },
                
                default: ""
            },

            doc: {
                
                async get () {
                    return this.evaluate(this.context);
                },
                
                default: {text:"", data:{}}
            }
        },
        
        watch: {
            
            fileContent () {
                this.source = this.fileContent;
            },
            
            source () {
                this.editorContent = this.source;
            },
            
            doc () {
                this.$emit('doc-rendered', this.doc.data);
            }
        },
        
        methods: {
            
            commit () {
                this.source = this.editorContent;
            },
            
            async save () {
                this.commit();
                await this.store.write(this.path, this.source);
            },
            
            async delete () {
                await this.store.delete(this.path);
                this.source = "";
            }
        }
    }
</script>

<style>

    .olo-document {
        height: 100%;
    }

</style>
