const expect = require("chai").expect;
const {PublicAuth, ReadOnlyAuth} = require("../lib/auth");


describe("auth", () => {
    
    describe("PublicAuth", () => {
        
        describe("read", () => {
            it("should always return true", async () => {
                const auth = new PublicAuth();
                expect( await auth.read("randomAuthHdr1", "randomURL1")).to.be.true;
                expect( await auth.read("randomAuthHdr2", "randomURL2")).to.be.true;
            });
        });
        
        describe("write", () => {
            it("should always return true", async () => {
                const auth = new PublicAuth();
                expect( await auth.write("randomAuthHdr1", "randomURL1")).to.be.true;
                expect( await auth.write("randomAuthHdr2", "randomURL2")).to.be.true;
            });            
        });
    });
    
    describe("ReadOnlyAuth", () => {
        
        describe("read", () => {
            it("should always return true", async () => {
                const auth = new ReadOnlyAuth();
                expect( await auth.read("randomAuthHdr1", "randomURL1")).to.be.true;
                expect( await auth.read("randomAuthHdr2", "randomURL2")).to.be.true;
            });    
        });
        
        describe("write", () => {
            it("should always return false", async () => {
                const auth = new ReadOnlyAuth();
                expect( await auth.write("randomAuthHdr1", "randomURL1")).to.be.false;
                expect( await auth.write("randomAuthHdr2", "randomURL2")).to.be.false;
            });                
        });
    });
});
