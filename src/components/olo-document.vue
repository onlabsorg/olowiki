<template>
    <v-card class="olo-document" elevation="3" rounded>
        
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
            path: "",
            source: "",
            evaluate: () => ({}),
            text: "",
            data: {},
            editorContent: "",
        }),
        
        computed: {
            
            context () {
                return this.store ? this.store.createContextFromId(this.docid) : {};
            }
        },
        
        watch: {
            
            context () {
                this.render();
            }
        },
        
        methods: {
            
            async render () {
                if (this.context.__path__ !== this.path) {
                    this.path = this.context.__path__;
                    this.source = await this.store.read(this.path);
                    this.editorContent = this.source;
                    this.evaluate = this.store.parseDocument(this.source);
                }
                const {text, data} = await this.evaluate(this.context);
                this.text = text;
                this.data = data;
                this.$emit('doc-rendered', data);
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
        
        async mounted () {
            await this.render();
        }
    }
</script>

<style>

    .olo-document {
        height: 100%;
    }

</style>