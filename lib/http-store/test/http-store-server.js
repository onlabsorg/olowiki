// Start server:
// $ node test/http-store-server

const express = require("express");
const app = express();

app.all('*', (req, res, next) => {
    const authorizationHeader = req.get('Authorization');
    if (authorizationHeader && authorizationHeader.substr(0,7) === "Bearer ") {
        req.userId = authorizationHeader.substr(7);
    }
    next();
});

const ROOT_PATH = `${__dirname}/fs-store`;
const FSBackend = require("../lib/fs-backend");
const backend = new FSBackend(ROOT_PATH);

backend.allowRead = function (path, userId) {
    return userId === "Reader" || userId === "Writer";
}

backend.allowWrite = function (path, userId) {
    return userId === "Writer";
}


const HTTPStoreServer = require("../lib/http-store-server");
app.use('/store', HTTPStoreServer(backend));


app.listen(8888, () => {
    console.log(`http-store-server listening on port 8888 ...`);
});    
