
const olo = require('@onlabsorg/olojs');
const Server = require('../lib/server');

const express = require('express');
const fs = require('fs');

const homeStore = new olo.FileStore(`${__dirname}/home`);

const server = Server(homeStore);

server.listen(8010, err => {
    console.log("olowiki test server listening on port 8010")
    console.log("visit http://localhost:8010/test.html")
});