const express = require('express');
const bodyParser = require('body-parser');


function Router (store) {
    const router = express.Router();

    router.use(function (req, res, next) {
        req.authorization = (req.header && req.header.authorization) || undefined;
        next();
    });

    router.use(bodyParser.text());

    router.get('*', function (req, res, next) {
        store.read(req.path, req.authorization)
        .then((file) => {
            res.set(file.head);
            res.status(200).send(file.body);
        })
        .catch((error) => {
            res.status(400).send(error);
        });
    });

    router.post('*', function (req, res, next) {
        const docContent = req.body || "";
        store.write(req.path, docContent, req.authorization)
        .then(() => {
            res.status(200).send();
        })
        .catch((error) => {
            res.status(400).send(error);
        });
    });

    return router;
}


module.exports = Router;
