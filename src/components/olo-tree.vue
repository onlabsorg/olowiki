<template>
    <div>
        <v-treeview class="olo-tree-root"
            dense hoverable color="black"
            :items="rootItem"
            activatable :active="[active]" @update:active="notifyActiveItemChange"
            >
            <template v-slot:prepend="{}">
                <v-icon>mdi-home-outline</v-icon>
            </template>
            <template v-slot:label="{item}">
                {{mini ? "" : item.name}}
            </template>
        </v-treeview>
        <v-treeview class="olo-tree" :class="{hidden: mini}"
            dense hoverable color="black"
            :items="children"
            activatable :active="[active]" @update:active="notifyActiveItemChange"
            >
            <template v-slot:prepend="{ item }">
                <v-icon v-if="item.children">
                    mdi-file-document-multiple-outline
                </v-icon>
                <v-icon v-else>
                    mdi-file-document-outline
                </v-icon>
            </template>
        </v-treeview>
    </div>
</template>

<script>
import * as pathlib from 'path';

export default {

    name: 'olo-tree',

    props: ['store', 'root', 'active', 'mini'],

    data: () => ({
        toc: [],
    }),

    computed: {
        
        children () {
            return this.createChildren(this.rootId, this.toc)
        },
        
        rootItem () {
            return [{
                name: "Frontpage",
                id: this.rootId 
            }]
        },
        
        rootId () {
            return pathlib.normalize(`/${this.root}/`);
        }         
    },

    watch: {
        store () { this.updateTOC() },
        root  () { this.updateTOC() }
    },

    methods: {

        async updateTOC () {
            const {data} = await this.store.load(this.root);
            this.toc = Array.isArray(data.__toc__) ? data.__toc__ : [];
        },

        async handleStoreChange () {
            await this.updateTOC();
        },

        notifyActiveItemChange (activeItems) {
            this.$emit('update:active', activeItems[0] || "");
        },
        
        createChildren (path, toc) {
            return toc.map(item => {
                
                if (typeof item === "string") {
                    item = {name: item};
                }
                
                if (!item.target) {
                    item.target = item.name.toLowerCase().replaceAll(' ','_');
                }
                
                const child = {
                    name: item.name,
                    id: this.store.normalizePath(
                            this.store.resolvePath(path, item.target) + (item.children ? '/' : ""))
                };
                
                if (Array.isArray(item.children)) {
                    child.children = this.createChildren(child.id, item.children);
                }
                
                return child;
            });            
        }
    },

    async mounted () {
        await this.updateTOC();
        this.store.onChange(this.handleStoreChange.bind(this));
    }
}
</script>

<style>

    .olo-tree-root .v-treeview-node__level {
        display: none;
    }
    
    .olo-tree.hidden {
        display: none;
    }
</style>
