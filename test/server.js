
const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.static(`${__dirname}/../dist`));

app.listen(8010, err => {
    console.log("olowiki test server listening on port 8010")
    console.log("visit http://localhost:8010")
});