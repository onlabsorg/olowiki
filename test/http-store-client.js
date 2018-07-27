
require("isomorphic-fetch");

const Document = require("../lib/olojs/document");

const Client = require("../lib/olojs/stores/http-store-client");
const client = new Client();


async function runtest () {
    const docURL = "http://localhost:8888/docs/testdoc";
    const userId = "m.delbuono@gmail.com";
    
    // read existing document
    console.log("Reading document", docURL);
    const doc = await client.readDocument(docURL, userId);
    console.log(String(doc));
    console.log(await doc.render())
    
    // write existing document
    if (!doc.data.modif) doc.data.modif = "x";
    else doc.data.modif += "x";
    console.log("Writing document", docURL);
    await client.writeDocument(docURL, doc, userId);
    
    // read new Document
    //const newDoc = await client.readDocument("http://localhost:8888/docs/non-existing-document.xml", userId);
    //console.log(String(newDoc));
}


runtest();
