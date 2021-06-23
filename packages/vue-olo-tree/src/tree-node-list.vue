<template>
    <md-list class="olo-tree-node-list">
        <md-list-item class="olo-tree-node" v-for="item in items" :key="item.path" v-bind:class="{highlighted:state.highlighted===item.path}"
                :md-expand="item.isDir" :md-expanded.sync="state.expanded[item.path]"
                @click.prevent.stop="emitTreeNodeClick({path:item.path})"
                @contextmenu.prevent.stop="emitTreeContextMenu({path:item.path, x:$event.clientX, y:$event.clientY})">

            <md-icon :md-src="item.isDir ? 'folder.svg' : 'document.svg'"></md-icon>
            <span class="md-list-item-text" :class="{active:item.path===state.selected}" ref="text">{{item.name}}</span>

            <olo-tree-node-list slot="md-expand" class="child-list" v-if="item.isDir"
                    :store="store"
                    :path="item.path"
                    :state="state"
                    @olo-tree-node-click="emitTreeNodeClick"
                    @olo-tree-contextmenu="emitTreeContextMenu">
            </olo-tree-node-list>
        </md-list-item>
    </md-list>
</template>

<script>
    const pathlib = require('path');

    const Vue = require("vue/dist/vue");
    Vue.use( require("vue-material/dist/components/MdButton").default );
    Vue.use( require("vue-material/dist/components/MdIcon").default );
    Vue.use( require("vue-material/dist/components/MdList").default );

    const isDir = name => name.slice(-1) === '/';
    const isDoc = name => !isDir(name) && name !== "";
    const isVisible = name => name[0] !== '.';
    
    require('vue-material/dist/vue-material.css');
    require('vue-material/dist/theme/default.css'); 
    require('./folder.svg');
    require('./document.svg');

    module.exports = {
        
        name: "olo-tree-node-list",

        props: ['store', 'path', 'state'],

        data: () => ({
            items: [],
        }),

        watch: {
            
            path: function () {
                this.updateItems();
            },
        },

        methods: {

            async updateItems () {
                const nodePath = pathlib.normalize(`/${this.path}/`);
                const childNames = await this.store.list(nodePath);
                const dirItems = childNames.filter(isDir).filter(isVisible).sort().map(name => ({
                    isDir: true,
                    name: name.slice(0,-1),
                    path: this.path + name,                
                }));
                const docItems = childNames.filter(isDoc).filter(isVisible).sort().map(name => ({
                    isDir: false,
                    name: name,
                    path: this.path + name,
                }));
                this.items = dirItems.concat(docItems);
            },
            
            emitTreeContextMenu (data) {
                this.$emit('olo-tree-contextmenu', data);
            },

            emitTreeNodeClick (data) {
                this.$emit('olo-tree-node-click', data);
            }
        },

        mounted () {
            this.store.onChange(change => {
                if (change.path.indexOf(this.path) === 0) {
                    this.updateItems();
                }
            });
            this.updateItems();
        }
    };
</script>

<style>

    .olo-tree-node .md-list-item-content {
        min-height: 32px;
    }

    .olo-tree-node .md-list-item-content>.md-icon:first-child {
        margin-right: 8px;
    }

    .olo-tree-node .child-list {
        margin-left: 16px;
    }

    .olo-tree-node .md-list-item-expand {
        border: none;
    }

    .olo-tree-node i.md-list-expand-icon {
        display: none;
    }

    .olo-tree-node.md-list-item.highlighted > .md-list-item-container > .md-list-item-content {
        border: 1px dashed #1976D2;
    }
    
    .olo-tree-node .md-list-item-text.active {
        font-weight: bold;
        color: #1976D2;
    }
</style>