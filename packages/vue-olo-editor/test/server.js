const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.static(`${__dirname}/dist`));

app.listen(8010, err => {
    console.log("vue-olo-editor test server listening on port 8010")
    console.log("visit localhost:8010")
});