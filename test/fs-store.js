

const Document = require("../lib/olojs/document");
const Store = require("../lib/olojs/stores/fs-store");

const store = new Store(`${__dirname}/store`);



async function runtest () {
    
    const doc = new Document({
        title: "Test document",
        author: "m.delbuono@gmail.com",
        public: true,
        template: "Test document template."
    });
    
    await store.writeDocument("testdoc", doc, "m.delbuono@gmail.com");
    
    const doc2 = await store.readDocument("testdoc", "m.delbuono@gmail.com");
    console.log(String(doc2));    
}


runtest();
