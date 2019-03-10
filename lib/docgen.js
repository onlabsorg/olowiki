const fs = require('fs');

module.exports = function (sourcePath) {
    const source = fs.readFileSync(sourcePath, "utf8");
    const docChunks = source.match(/\/\*\*.*\*\//g);
    console.log(docChunks);
}
