// Run test:
// $ node test/http-store-server
// $ mocha test/http-store-client

require("isomorphic-fetch")

const fs = require("fs");
const rimraf = require("rimraf");

const FSBackend = require("../lib/fs-backend");
const ROOT_PATH = `${__dirname}/fs-store`;

const HTTPStore = require("../lib/http-store-client");
const STORE_URL = `http://localhost:8888/store`;

async function Store (content) {
    const backend = new FSBackend(ROOT_PATH);
    const store = new HTTPStore(STORE_URL, "Bearer Writer");
    
    // clear the store
    await new Promise((resolve, reject) => {
        rimraf(`${ROOT_PATH}`, (err) => {
            if (err) reject(err);
            else resolve();
        })
    });
    
    fs.mkdirSync(ROOT_PATH);
    
    // create all the listed documents
    for (let path in content) {
        await backend.write(path, content[path]);
    }
    
    return store;
}

const test = require("olojs/test/store");
test("HTTPStore", Store);





const expect = require("chai").expect;
const errors = require("olojs/lib/errors");

describe("HTTPStore access control", () => {
    
    describe("read operation", () => {
        it("should throw `olojs.errors.ReadAccessDenied` if the user has no read permission", async () => {
            const store = new HTTPStore(STORE_URL, "Bearer Guest");
            
            var error = null;
            try {
                await store.read("/path/to/doc1");
            } catch (e) {
                error = e;
            }
            expect(error).to.be.instanceof(errors.ReadAccessDenied);
            expect(error.message).to.equal("Read access denied on path '/path/to/doc1'");

            var error = null;
            try {
                await store.read("/path/to/container1/");
            } catch (e) {
                error = e;
            }
            expect(error).to.be.instanceof(errors.ReadAccessDenied);
            expect(error.message).to.equal("Read access denied on path '/path/to/container1/'");
        });
    });

    describe("write operation", () => {
        it("should throw `olojs.errors.ReadAccessDenied` if `allowRead(path, userId)` return false", async () => {
            const store = new HTTPStore(STORE_URL, "Bearer Reader");
            
            var error = null;
            try {
                await store.write("/path/to/doc1", "new doc1 content");
            } catch (e) {
                error = e;
            }
            expect(error).to.be.instanceof(errors.WriteAccessDenied);
            expect(error.message).to.equal("Write access denied on path '/path/to/doc1'");
        });
    });

    describe("delete operation", () => {
        it("should throw `olojs.errors.ReadAccessDenied` if `allowRead(path, userId)` return false", async () => {
            const store = new HTTPStore(STORE_URL, "Bearer Reader");
            
            var error = null;
            try {
                await store.delete("/path/to/doc1");
            } catch (e) {
                error = e;
            }
            expect(error).to.be.instanceof(errors.WriteAccessDenied);
            expect(error.message).to.equal("Write access denied on path '/path/to/doc1'");

            var error = null;
            try {
                await store.delete("/path/to/container1/");
            } catch (e) {
                error = e;
            }
            expect(error).to.be.instanceof(errors.WriteAccessDenied);
            expect(error.message).to.equal("Write access denied on path '/path/to/container1/'");
        });
    });
});
