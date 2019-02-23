
const expect = require("chai").expect;
const stripIndent = require("strip-indent");
const errors = require("../lib/errors");


module.exports = function (storeName, store, testInfo) {
    
    describe(storeName, () => {
        
        describe("store.read(path)", () => {
            
            it("should asynchronously return the source of the writeable document at path", async () => {
                const source = await store.read(testInfo.rwdoc_URL);
                expect(source).to.equal(testInfo.rwdoc_Source);
            });
            
            if (testInfo.rodoc_URL) {
                it("should asynchronously return the source of the read-only document at path", async () => {
                    const source = await store.read(testInfo.rodoc_URL);
                    expect(source).to.equal(testInfo.readOnlySource);
                });
            }

            if (testInfo.privatedoc_URL) {
                it("should throw errors.ReadAccessDenied if trying to read a private document", async () => {
                    try {
                        let source = await store.read(testInfo.privatedoc_URL);
                        throw new Error("it didn't throw");
                    } catch (error) {
                        expect(error).to.be.instanceof(errors.ReadAccessDenied);
                    }                
                });
            }

            it("should throw errors.DocumentNotFound if the document doesn't exist", async () => {
                try {
                    let source = await store.read(testInfo.nodoc_URL);
                    throw new Error("it didn't throw");
                } catch (error) {
                    expect(error).to.be.instanceof(errors.DocumentNotFound);
                }                
            });
        });
        
        describe("store.write(path, source)", () => {
            
            it("should update the source of an existing document", async () => {
                const source = "newKey: new value";
                await store.write(testInfo.rwdoc_URL, source);
                expect(await store.read(testInfo.rwdoc_URL)).to.equal(source);      
            });
            
            if (testInfo.rodoc_URL) {
                it("should throw errors.WriteAccessDenied if trying to update a read-only document", async () => {
                    try {
                        let source = await store.write(testInfo.rodoc_URL, "...");
                        throw new Error("it didn't throw");
                    } catch (error) {
                        expect(error).to.be.instanceof(errors.WriteAccessDenied);
                    }                
                });
            }

            if (testInfo.privatedoc_URL) {
                it("should throw errors.WriteAccessDenied if trying to update a private document", async () => {
                    try {
                        let source = await store.write(testInfo.privatedoc_URL, "...");
                        throw new Error("it didn't throw");
                    } catch (error) {
                        expect(error).to.be.instanceof(errors.WriteAccessDenied);
                    }                
                });
            }

            it("should create a new document if the document doesn't exist", async () => {
                const source = "newKey: new value";
                await store.write(testInfo.nodoc_URL, source);
                expect(await store.read(testInfo.nodoc_URL)).to.equal(source);                
            });            
        });
        
        describe("store.delete(path)", () => {
            
            it("should delete an existing document", async () => {
                await store.delete(testInfo.rwdoc_URL);
                try {
                    let source = await store.read(testInfo.rwdoc_URL);
                    throw new Error("it didn't throw");
                } catch (error) {
                    expect(error).to.be.instanceof(errors.DocumentNotFound);
                }                
            });
            
            if (testInfo.rodoc_URL) {
                it("should throw errors.WriteAccessDenied if trying to delete a read-only document", async () => {
                    try {
                        let source = await store.delete(testInfo.rodoc_URL, "...");
                        throw new Error("it didn't throw");
                    } catch (error) {
                        expect(error).to.be.instanceof(errors.WriteAccessDenied);
                    }                
                });
            }

            if (testInfo.privatedoc_URL) {
                it("should throw errors.WriteAccessDenied if trying to delete a private document", async () => {
                    try {
                        let source = await store.delete(testInfo.privatedoc_URL, "...");
                        throw new Error("it didn't throw");
                    } catch (error) {
                        expect(error).to.be.instanceof(errors.WriteAccessDenied);
                    }                
                });
            }

            it("should return silently if the document already doesn't exist", async () => {
                await store.delete(testInfo.rwdoc_URL);
                try {
                    let source = await store.read(testInfo.rwdoc_URL);
                    throw new Error("it didn't throw");
                } catch (error) {
                    expect(error).to.be.instanceof(errors.DocumentNotFound);
                }                
            });            
        });
    });
}
