
const stripIndent = require("strip-indent");

exports.USER1_PUBLIC_DOC_CONTENT = stripIndent(`
    author: "User1"
    public: true
    `);
    
exports.USER2_PUBLIC_DOC_CONTENT = stripIndent(`
    author: "User2"
    public: true
    `);
    
exports.USER1_PRIVATE_DOC_CONTENT = stripIndent(`
    author: "User1"
    public: false
    `);
    
exports.USER2_PRIVATE_DOC_CONTENT = stripIndent(`
    author: "User2"
    public: false
    `);
