<template>
    <div class="olowiki-container">
        <olowiki-app :title="title" @key="handleKeyboardCommand">
            
            <md-icon slot="logo" md-src="/olowiki.svg"></md-icon>
            
            <md-button slot="button" class="md-icon-button" @click="goToUpperContainer">
                <md-icon>arrow_upward</md-icon>
            </md-button>            
            
            <div slot="content" class="content">
                <md-list>
                    <md-list-item v-for="item in items" :href="getPathOf(item)">
                        <md-icon v-if="item.isContainer">folder</md-icon>
                        <md-icon v-else>description</md-icon>
                        <span class="md-list-item-text">{{item.name}}</span>
                        <md-button class="md-icon-button md-list-action" @click.prevent="showDeleteDialog(item)">
                            <md-icon>delete</md-icon>
                        </md-button>
                    </md-list-item>
                </md-list>
            </div>

        </olowiki-app>
        
        <md-dialog :md-active.sync="deleteDialog.show">
            <md-dialog-title>Delete {{deleteDialog.path}}</md-dialog-title>
            <md-dialog-content>
                <p>Do you want to <strong>permanently</strong> delete this resource?</p>
            </md-dialog-content>
            <md-dialog-actions>
                <md-button class="md-primary" @click="deleteItem(deleteDialog.path)">Yes</md-button>
                <md-button class="md-primary" @click="deleteDialog.show = false">No</md-button>
            </md-dialog-actions>
        </md-dialog>     

    </div>        
</template>

<script>
    const olojs = require("olojs");
    const client = require("../lib/client");

    const Vue = require("vue/dist/vue");
    Vue.use( require("vue-material/dist/components/MdButton").default );
    Vue.use( require("vue-material/dist/components/MdList").default );
    Vue.use( require("vue-material/dist/components/MdDialog").default );

    module.exports = {
        
        components: {
            'olowiki-app': require("./app.vue").default,            
        },
        
        data: () => ({
            items: [],
            deleteDialog: {
                show: false,
                path: ""
            }
        }),  
        
        computed: {
            
            version () {
                const metaElt = document.querySelector(`head meta[name="version"]`);
                return metaElt ? metaElt.getAttribute("content") : "unknown";
            },
            
            title () {
                return location.pathname.split("/").slice(-2).join("/");
            },
            
        },
        
        // asyncComputed: {},
                
        methods: {
            
            async loadItems () {
                const containerDoc = await client.read(location.pathname);
                const context = containerDoc.createContext();
                const containerDocValue = await containerDoc.evaluate(context);
                const items = [];
                for (let item of containerDocValue.items) {
                    if (item.slice(-1) === "/") {
                        let name = item.slice(0, -1);
                        items.push({
                            fullName: item,
                            name: name,
                            isContainer: true,
                            toString: () => "0" + name
                        })
                    } else {
                        items.push({
                            fullName: item,
                            name: item,
                            isContainer: false,
                            toString: () => "1" + item
                        })
                    }
                }
                this.items = items.sort();
            },
            
            getPathOf (item) {
                return location.pathname + item.fullName;
            },
            
            goToUpperContainer () {
                const newPath = location.pathname.split("/").slice(0,-2).join("/") + "/"
                location.pathname = newPath;
            },
            
            showDeleteDialog (item) {
                this.deleteDialog.path = this.getPathOf(item);
                this.deleteDialog.show = true;
            },
            
            async deleteItem (itemPath) {
                this.deleteDialog.show = false;
                try {
                    if (itemPath.slice(-1) !== "/") itemPath += "/";
                    await client.delete(itemPath);
                    await this.loadItems();
                    this.showMessage(`Deleted ${itemPath}`);
                } catch (error) {
                    console.error(error);
                    this.showMessage("Delete operation failed!");
                }
            },
            
            showMessage (content) {
                this.$emit('message', content);
            },

            handleKeyboardCommand (event) {
                switch (event.keyString) {}
            }            
        },
        
        mounted () {
            this.loadItems();
        }
    };
</script>

<style>

    .olowiki-container div.content {
        margin: 2em 10% 2em 10%;
    }

</style>
