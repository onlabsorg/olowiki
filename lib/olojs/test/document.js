
var expect = require("chai").expect;
var stripIndent = require("strip-indent");

var context = require("../lib/context");
var Document = require("../lib/document");


describe("Document", () => {
    
    describe("document.source - property", () => {
        it("should contain she first argument passed to the constructor", () => {
            var source = "abcdef";
            var doc = new Document(source, context);
            expect(doc.source).to.equal(source);
        });
    });
    
    describe("document.context - property", () => {
        
        it("should contain the object passed as second argument to the constructor", () => {
            var context = {};
            var doc = new Document("", context);
            expect(doc.context).to.equal(context);
        });
        
        it("should default to `olojs.context` if the context constructor parameter is omitted", () => {
            var doc = new Document("");
            expect(doc.context).to.equal(context);            
        });
    });
    
    describe("docNamespace = document.evaluate(localScope)", () => {
        
        it("should contain the names defined by the inline expressions `<%...%>`", async () => {
            var source = stripIndent(`
                <%a=10%> <%b=a+10%> <%c=b+10%>
                `);
            var doc = new Document(source, context);
            var docNS = await doc.evaluate();
            expect(docNS).to.deep.equal({a:10, b:20, c:30, toString:docNS.toString});
        });
        
        it("should augument the context with the passed `localScope` before rendering", async () => {
            var source = stripIndent(`
                <%a=x%> <%b=a+10%> <%c=b+10%>
                `);
            var doc = new Document(source, context);
            var docNS = await doc.evaluate({x:10});
            expect(docNS).to.deep.equal({x:10, a:10, b:20, c:30, toString:docNS.toString});            
        });
        
        it("should stringify to a text obtained by replacing the inline expressions `<%...%>` with their value", async () => {
            var scope = Object.create(context);
            scope.x = 10;
            var source = stripIndent(`x * 2 = <%x*2%>`);
            var doc = new Document(source, scope);
            var docNS = await doc.evaluate();
            expect(String(docNS)).to.equal("x * 2 = 20");
        });
        
        it("should stringify the inline expressions results using the context `str` method", async () => {
            var scope = Object.create(context);
            scope.a = ["a","b","c"];
            var source = stripIndent(`str(a) = "<%a%>"`);
            var doc = new Document(source, scope);
            var docNS = await doc.evaluate();
            expect(String(docNS)).to.equal(`str(a) = "abc"`);            
        });
    });
});
