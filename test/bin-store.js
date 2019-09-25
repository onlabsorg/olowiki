const expect = require("chai").expect;
const Path = require("path");
const olojs = require("olojs");
const client = require("../lib/client");

describe("bin-store", () => {
    
    describe("read document", () => {
        
        it("should return a document with presets and body defined in a javascript module", async () => {
            var doc = await client.read("/bin/text");
            var textScript = require("../lib/bin-backend/text");
            
            expect(doc).to.be.instanceof(olojs.Document);
            expect(doc.presets).to.equal(textScript.presets);
            expect(doc.body).to.equal(textScript.body);
        });
    });
    
    describe("write document", () => {
        
        it("should throw a WriteAccessDenied error", async () => {
            try {
                var doc = await client.write("/bin/text");
                throw new Error("It didn't throw");
            } catch (error) {
                expect(error).to.be.instanceof(olojs.errors.WriteAccessDenied);
            }
        });
    });

    describe("delete document", () => {
        
        it("should throw a WriteAccessDenied error", async () => {
            try {
                var doc = await client.delete("/bin/text");
                throw new Error("It didn't throw");
            } catch (error) {
                expect(error).to.be.instanceof(olojs.errors.WriteAccessDenied);
            }
        });
    });
    
    describe("/bin/text", () => {
        var textDoc, context;
        
        before(async () => {
            textDoc = await client.read("/bin/text");
            context = textDoc.createContext();
        });
        
        describe("text.render(template)", () => {
            it("should return the template, replacing the `{name}` fields with the `name` value", async () => {
                var template = "1 + 2 = {{1+2}}";
                textDoc.presets.x = 3;
                var retval = await textDoc.presets.render("1 + 2 = {x}");
                expect(retval).to.equal("1 + 2 = 3");
            });
        });
    });

    describe("/bin/list", () => {
        var listDoc, context;
        
        before(async () => {
            listDoc = await client.read("/bin/list");
            context = listDoc.createContext();
        });
        
        describe("list.reverse(X)", () => {
            
            it("should return the reversed list `X`", async () => {
                var retval = await listDoc.presets.reverse([1,10,3,2]);
                expect(retval).to.deep.equal([2,3,10,1]);
            });
        });
    });

    describe("/bin/math", () => {
        var mathDoc, context;
        
        before(async () => {
            mathDoc = await client.read("/bin/math");
            context = mathDoc.createContext();
        });
        
        describe("math.int(X)", () => {
            it("should return the number X rounded to the closest integer", async () => {
                var retval = await mathDoc.presets.int(13.6);
                expect(retval).to.equal(14);
            });
            it("should return NOTHING if X is not a number", async () => {
                var retval = await mathDoc.presets.int("abc");
                expect(retval).to.equal(context.NOTHING);                
            });
        });
    });

    describe("/bin/markdown", () => {
        var mdDoc, context;
        
        before(async () => {
            mdDoc = await client.read("/bin/markdown");
            context = mdDoc.createContext();
        });
        
        describe("markdown(text)", () => {
            it("should translate the passed markdown `text` to HTML", async () => {
                var retval = await mdDoc.presets.__call__("**bold**");
                expect(retval).to.equal("<p><strong>bold</strong></p>\n");
            });
        });
    });
});
