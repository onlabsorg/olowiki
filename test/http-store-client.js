
require("isomorphic-fetch");

const Document = require("../lib/olojs/document");

const Client = require("../lib/olojs/stores/http-store-client");
const client = new Client();


async function runtest () {
    const docURL = "http://localhost:8888/docs/testdoc.xml";
    const userId = "m.delbuono@gmail.com";
    
    // read existing document
    const doc = await client.readDocument(docURL, userId);
    console.log(String(doc));
    
    // write existing document
    const newChild = new Document.Element("span");
    newChild.children.push(new Document.Text("Content added by http-store-client test script"));
    doc.content.children.push(newChild);
    await client.writeDocument(docURL, doc, userId);
    
    // render document 
    const html = await doc.render({});
    console.log(html);
    
    // read new Document
    //const newDoc = await client.readDocument("http://localhost:8888/docs/non-existing-document.xml", userId);
    //console.log(String(newDoc));
}


runtest();
