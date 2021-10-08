
const olo = require('@onlabsorg/olojs');
const Server = require('../lib/server');

const express = require('express');
const fs = require('fs');

const child_process = require('child_process');
function exec (command) {
    let options = {
        cwd: __dirname
    };
    return new Promise((resolve, reject) => {
        child_process.exec(command, options, (error, stdout, stderr) => {
            if (error) reject(error); else resolve();
        });            
    });
}

const homeStore = new olo.FileStore(`${__dirname}/home`);

const server = Server(homeStore);

server.listen(8010, async err => {
    if (err) throw err;
    console.log("olowiki test server listening on port 8010")
    //console.log("Go to http://localhost:8010#/home/test")
    await exec(`xdg-open http://localhost:8010#/home/test`);
});