const {expect} = require('chai');
const olojs = require('@onlabsorg/olojs');
const ObservableStore = require('.');

describe("store = ObservableStore(targetStore)", () => {
    
    it("should be an instance of olojs.Store", () => {
        const store = ObservableStore(new olojs.MemoryStore());
        expect(store).to.be.instanceof(olojs.Store);
    });
    
    describe('store.onChange', () => {
        it("should be a function", () => {
            const store = ObservableStore(new olojs.MemoryStore());
            expect(store.onChange).to.be.a("function");
        });
    });
    
    describe('store.write(path, source)', () => {
        
        it("should update the source mapped to path in the target store", async () => {
            const targetStore = new olojs.MemoryStore();
            const store = ObservableStore(targetStore);
            await store.write('/path/to/doc', "new content");
            expect(await targetStore.read('path/to/doc')).to.equal("new content");
        });

        it("should call all the listener registered with `onChange` after updating the target store", async () => {
            const events = [];
            const targetStore = new olojs.MemoryStore();
            const store = ObservableStore(targetStore);
            store.onChange(change => events.push({listener:1, change:change}));
            store.onChange(change => events.push({listener:2, change:change}));
            await store.write('path/to/doc', "new content");
            expect(events).to.deep.equal([
                {listener:1, change:{op:'SET', path:'/path/to/doc', value:"new content"}},
                {listener:2, change:{op:'SET', path:'/path/to/doc', value:"new content"}}
            ])            
        });
    });

    describe('store.delete(path)', () => {
        
        it("should remove source mapped to path in the target store", async () => {
            const targetStore = new olojs.MemoryStore({
                '/path/to/doc1': "document 1",
                '/path/to/doc2': "document 2",
            });
            const store = ObservableStore(targetStore);
            await store.delete('/path/to/doc1');
            expect(await targetStore.read('path/to/doc1')).to.equal("");
            expect(await targetStore.read('path/to/doc2')).to.equal("document 2");
        });

        it("should call all the listener registered with `onChange` after updating the target store", async () => {
            const events = [];
            const targetStore = new olojs.MemoryStore({
                '/path/to/doc1': "document 1",
                '/path/to/doc2': "document 2",
            });
            const store = ObservableStore(targetStore);
            store.onChange(change => events.push({listener:1, change:change}));
            store.onChange(change => events.push({listener:2, change:change}));
            await store.delete('path/to/doc1');
            expect(events).to.deep.equal([
                {listener:1, change:{op:'DEL', path:'/path/to/doc1'}},
                {listener:2, change:{op:'DEL', path:'/path/to/doc1'}}
            ])                        
        });
    });

    describe('store.deleteAll(path)', () => {
        
        it("should remove the directory mapped to path in the target store", async () => {
            const targetStore = new olojs.MemoryStore({
                '/path/to/dir1/doc1': "document 1.1",
                '/path/to/dir1/doc2': "document 1.2",
                '/path/to/dir2/doc1': "document 2.1",
                '/path/to/dir2/doc2': "document 2.2",
            });
            const store = ObservableStore(targetStore);
            await store.deleteAll('/path/to/dir1');
            expect(await targetStore.read('path/to/dir1/doc1')).to.equal("");
            expect(await targetStore.read('path/to/dir1/doc2')).to.equal("");
            expect(await targetStore.read('path/to/dir2/doc1')).to.equal("document 2.1");            
            expect(await targetStore.read('path/to/dir2/doc2')).to.equal("document 2.2");            
        });

        it("should call all the listener registered with `onChange` after updating the target store", async () => {
            const events = [];
            const targetStore = new olojs.MemoryStore({
                '/path/to/doc1': "document 1",
                '/path/to/doc2': "document 2",
            });
            const store = ObservableStore(targetStore);
            store.onChange(change => events.push({listener:1, change:change}));
            store.onChange(change => events.push({listener:2, change:change}));
            await store.deleteAll('path/to/dir1');
            expect(events).to.deep.equal([
                {listener:1, change:{op:'DEL', path:'/path/to/dir1/'}},
                {listener:2, change:{op:'DEL', path:'/path/to/dir1/'}}
            ])                                    
        });
    });
});

