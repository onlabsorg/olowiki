

const fs = require("fs");

const path = `${__dirname}/../.olo`;

if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
}

exports.path = path;
