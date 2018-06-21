

const Document = require("../lib/olojs/document");
const Store = require("../lib/olojs/stores/fs-store");

const store = new Store(`${__dirname}/store`);



async function runtest () {
    
    const doc = new Document(`
        <title>Test document</title>
        <author id="m.delbuono@gmail.com" />
        <content>
            <h1>Header 1</h1>
            <div>Some content</div>
            <span>Some other content</span>
        </content>
    `);
    
    await store.writeDocument("testdoc.xml", doc, "m.delbuono@gmail.com");
    
    const doc2 = await store.readDocument("testdoc.xml", "m.delbuono@gmail.com");
    console.log(String(doc2));
    
    if (String(doc2) === String(doc)) console.log("*** OK ***");
    else console.log("*** :( BAD! ***");
}


runtest();
