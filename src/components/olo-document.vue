<template>
    <v-card class="olo-document" rounded>
        
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
    export default {
        name: "olo-document",
        
        components: {
            'olo-viewer': () => import('./olo-viewer'),
            'olo-editor': () => import('./olo-editor'),
        },    
        
        props: ['store', 'docid', 'mode'],
        
        data: () => ({
            source: "",
            text: "",
            data: {},
            editorContent: "",
        }),
        
        computed: {
            
            context () {
                return this.store ? this.store.createContextFromId(this.docid) : {};
            },
            
            path () {
                return this.context.__path__;
            },
            
            evaluate () {
                return this.store.parseDocument(this.source);
            },
            
            sourcePromise () {
                return this.store.read(this.path);
            },
            
            contentPromise () {
                return this.evaluate(this.context);
            }
        },
        
        watch: {
            
            'sourcePromise': async function () {
                this.source = await this.sourcePromise;
                this.editorContent = this.source;
            },
            
            'contentPromise': async function () {
                const {text, data} = await this.contentPromise;
                this.text = text;
                this.data = data;
                this.$emit('doc-rendered', data);
            },
            
            'source': function () {
                this.editorContent = this.source;
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