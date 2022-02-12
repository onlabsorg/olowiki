<template>
    <v-treeview class="olo-tree"
        dense hoverable color="black"

        :items="children"
        :load-children="injectChildren"
        
        activatable
        :active="[active]"
        @update:active="notifyActiveItemChange"
        >
        <template v-slot:prepend="{ item, open }">
            <v-icon v-if="item.children">
                {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
            </v-icon>
            <v-icon v-else>
                mdi-file-document-outline
            </v-icon>
        </template>
        <template v-slot:append="{ item, leaf }">
            <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <olo-menu-item v-if="!leaf"
                        icon="mdi-plus"
                        title="New" 
                        kbshortcut="" 
                        @click="$emit('add-item', item.id)"
                        >
                    </olo-menu-item>
                    <olo-menu-item 
                        icon="mdi-content-copy"   
                        title="Copy"
                        kbshortcut="" 
                        @click="$emit('copy-item', item.id)"
                        >
                    </olo-menu-item>
                    <olo-menu-item 
                        icon="mdi-delete"   
                        title="Delete"       
                        kbshortcut="" 
                        @click="$emit('delete-item', item.id)"  
                        >
                    </olo-menu-item>
                    <olo-menu-item 
                        icon="mdi-download" 
                        title="Download"
                        kbshortcut="" 
                        @click="$emit('download-item', item.id)"
                        >
                    </olo-menu-item>
                </v-list>
            </v-menu>
        </template>
    </v-treeview>
</template>

<script>
import * as pathlib from 'path';

export default {
    
    name: 'olo-tree',
    
    components: {
        'olo-menu-item': () => import('./olo-menu-item'),
    },
    
    props: ['store', 'root', 'active'],
    
    data: () => ({
        children: [],
    }),
    
    computed: {
    
        id () {
            return pathlib.normalize(`/${this.root}/`);
        }
    },
    
    methods: {
        
        async loadChildren (path) {
            let names;
            try {
                names = await this.store.list(path);
            } catch (e) {
                names = [];
            }
            const directories = []; 
            const documents = [];
            for (let name of names.sort().filter(n => n !== "" && n[0] !== ".")) {
                const child = {};
                child.id = pathlib.normalize(`/${path}/${name}`);
                if (name.slice(-1) === "/") {
                    child.name = name.slice(0,-1);
                    child.children = [];
                    directories.push(child);
                } else {
                    child.name = name;
                    documents.push(child);
                }
            }
            return directories.concat(documents);
        },
        
        async injectChildren (item) {
            item.children = await this.loadChildren(item.id);
        },
        
        notifyActiveItemChange (activeItems) {
            this.$emit('update:active', activeItems[0] || "");
        },
        
        async refresh (item) {            
            const newChildren = await this.loadChildren(item.id);
            let lastIndex = 0;
            for (let newChild of newChildren) {
                const child = item.children.find(child => child.id === newChild.id);
                if (child) {
                    lastIndex = item.children.indexOf(child);
                    if (child.children) await this.refresh(child);
                } else {
                    item.children.splice(lastIndex+1, 0, newChild);
                }
            }
            
            const itemsToBeDeleted = [];
            for (let child of item.children) {
                const found = newChildren.find(newChild => newChild.id === child.id);
                if (!found) itemsToBeDeleted.push(child);
            }
            for (let child of itemsToBeDeleted) {
                const index = item.children.indexOf(child);
                item.children.splice(index, 1);
            }
        }
    },
    
    async mounted () {
        this.children = await this.loadChildren(this.id);
        this.store.onChange(() => this.refresh(this));
    }
}
</script>

<style>
</style>