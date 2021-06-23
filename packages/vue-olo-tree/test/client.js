const Vue = require("vue/dist/vue");

require('@onlabsorg/olojs/browser/olo');
const targetStore = new olojs.MemoryStore({
    '/home/doc01': "document 0.1",
    '/home/dir1/doc11': "document 1.1",
    '/home/dir1/doc12': "document 1.2",
    '/home/dir1/doc13': "document 1.3",
    '/home/dir2/doc21': "document 2.1",
    '/home/dir2/doc22': "document 2.2",
    '/home/dir2/doc23': "document 2.3",
});

const ObservableStore = require('../../observable-store');
const store = ObservableStore(targetStore);

document.addEventListener("DOMContentLoaded", function () {
    
    const app = new Vue({
        
        el: '#root',
        
        components: {
            'vue-olo-tree': require('..')
        },

        data: {
            store: store,
            path: '/home/', 
            state: {
                selected: "/dir1/doc13",
                highlighted: "/dir1/doc12",
                expanded: {'/':true, '/dir1/':true}
            }, 
        },
        
        methods: {
                        
            logOloTreeContextMenu (event) {
                console.log('Event `olo-tree-contextmenu`', event);
            },
            
            logOloTreeNodeClick (event) {
                console.log('Event `olo-tree-node-clic`', event);
            }
        }
    });    
});

