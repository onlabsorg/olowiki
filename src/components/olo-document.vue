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
            
            text () {
                return this.docns.__text__ || "";
            }
        },
        
        asyncComputed: {
            
            docns: {
                
                async get () {
                    const doc = this.store.createDocument(this.path, this.source);
                    const context = doc.createContext(this.presets);
                    return await doc.evaluate(context);
                },
                
                default: {}
            }
        },
        
        watch: {
            
            store () {
                this.loadSource();
            },
            
            path () {
                this.loadSource();
            },
            
            source () {
                this.editorContent = this.source;
            },
            
            docns () {
                this.$emit('doc-rendered', this.docns);
            }
        },
        
        methods: {
            
            async loadSource () {
                try {
                    this.source = await this.store.read(this.path);
                } catch (error) {
                    this.source = `
                            <p><b>Failed to load ${this.path}</b></p>
                            <code><pre>${error.message}</pre></code>`
                }                
            },
            
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
        },
        
        mounted () {
            this.loadSource();
        }
    }
</script>

<style>

    .olo-document {
        height: 100%;
    }

</style>
