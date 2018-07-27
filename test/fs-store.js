

const Document = require("../lib/olojs/document");
const Store = require("../lib/olojs/stores/fs-store");

const store = new Store(`${__dirname}/store`);

const docPath = "testdoc";
const docContent = `
title: "Test document"
author: "m.delbuono@gmail.com"
public: true
main: !template "{{this.title}} authored by {{author}}."
`;


async function runtest () {
    
    const doc = store.createDocument(docPath, docContent);
    
    if (store._fileExists(docPath)) await store._deleteFile(docPath);
    await store.writeDocument("testdoc", doc, "m.delbuono@gmail.com");
    
    const doc2 = await store.readDocument("testdoc", "m.delbuono@gmail.com");
    const view = await doc2.render();
    console.log(doc2);    
    console.log(view)
}


runtest();
