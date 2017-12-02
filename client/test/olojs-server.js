

// testing olojs.Path
require("./olojs/path");


// testing olojs.Value
require("./olojs/value");


// testing olojs.Change
require("./olojs/change");


// testing olojs.Document
require("./olojs/document");


// testing olojs.FileStore

const YAML = require('js-yaml');
const fs = require('fs.promised');

const {FileStore} = require("../lib/olojs/store-server");
const storePath = `${__dirname}/olojs/store`;

const store = new FileStore(storePath);

async function writeFile (docPath, docText) {
    await fs.writeFile(`${storePath}/${docPath}`, docText);
}

async function fileExists (docPath) {
    return fs.existsSync(`${storePath}/${docPath}`);
}

async function deleteFile (docPath) {
    await fs.unlink(`${storePath}/${docPath}`);
}

const testStore = require("./olojs/store");
testStore('FileStore', store, writeFile, fileExists, deleteFile);
