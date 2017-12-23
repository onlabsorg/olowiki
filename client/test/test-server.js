const portParamIndex = process.argv.indexOf("--port") + 1;
const port = portParamIndex ? process.argv[portParamIndex] : 8010;

const express = require('express');

const http = require('http');

const basePath = `${__dirname}/..`;

const bodyParser = require('body-parser');
const fs = require('fs');

const {FileStore, Router} = require("../lib/olojs/store-server");
const olojsStore = new FileStore(`${__dirname}/olojs/store`);

const nodemailer = require("nodemailer");
const htmlMailTemplate = fs.readFileSync(`${__dirname}/templates/share-mail.html`, {encoding:'utf8'});
const textMailTemplate = fs.readFileSync(`${__dirname}/templates/share-mail.txt`, {encoding:'utf8'});


async function start () {
    const app = express();

    app.use("*", function (req, res, next) {
        req.userName = req.get('Authorization') || 'guest';
        next();
    });

    app.use(bodyParser.text());

    app.put("/fs/*", function (req, res, next) {
        fs.writeFileSync(`${__dirname}/olojs/store/${req.path.substr(4)}`, req.body, {encoding:'utf8'});
        res.status(200).send();
    });

    app.delete("/fs/*", function (req, res, next) {
        fs.unlinkSync(`${__dirname}/olojs/store/${req.path.substr(4)}`);
        res.status(200).send();
    });




    const etherealAccount = await nodemailer.createTestAccount();
    const olojsRouter = new Router(olojsStore, {
        secret: "test-jwt-key",
        smtp: {
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: etherealAccount.user, // generated ethereal user
                pass: etherealAccount.pass  // generated ethereal password
            }
        },
        mailTemplates: {
            text: textMailTemplate,
            html: htmlMailTemplate,
        }
    });

    app.use('/store', olojsRouter);

    app.use(express.static(basePath, {etag:false}));

    const server = http.createServer(app);

    await new Promise((resolve, reject) => {
        server.listen(port, resolve);
    });
}


start().then(() => {
    console.log(`olojs test web server listening on port ${port}!`);
});
