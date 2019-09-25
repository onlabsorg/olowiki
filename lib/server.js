
const Path = require("path");
const fs = require("fs");
const express = require('express');
const bodyParser = require('body-parser');

const FSBackend = require("./olojs/lib/backends/fs-backend");
const HTTPBackendServer = require("./olojs/lib/backends/http-backend-server");
const Store = require("./olojs/lib/store");

const auth = require("./auth");
const EMail = require("./email");
const JWT = require('jsonwebtoken');
const stripIndent = require("strip-indent");

const rootPath = Path.resolve(__dirname, "..");
const publicPath = `${rootPath}/public`;
const rootAppTemplate = fs.readFileSync(`${publicPath}/root.html`, 'utf8');
const containerAppTemplate = fs.readFileSync(`${publicPath}/container.html`, 'utf8');
const documentAppTemplate = fs.readFileSync(`${publicPath}/document.html`, 'utf8');
const testTemplate = fs.readFileSync(`${publicPath}/test.html`, 'utf8');

function renderTemplate (template, values) {
    var text = template;
    for (let key in values) {
        text = text.replace(`{{${key}}}`, values[key]);
    }
    return text;
}




module.exports = function Server (options={}) {    
    
    const server = express();  
    server.use( bodyParser.text() );

    const email = new EMail(options.email);

    // Serve the root single-page-app in case of root-path request
    server.get(`/`, (req, res, next) => {
        const html = renderTemplate(rootAppTemplate, {
            version: options.version
        });
        res.status(200).send(html);     
    });

    
    // Extract the Authorization bearer token payload and store it in req.user
    server.all(`*`, auth.Middleware(options.owner, options.secret) );
    
    
    server.get("/user", (req, res, next) => {
        res.status(200).json({
            id: req.user.id,
            attributes: req.user.attributes
        });
    });
    
    server.post(`/user`, async (req, res, next) => {
        var emailAddress = req.body;
        try {
            let user = new auth.User(emailAddress);
            let token = user.generateToken(options.secret);         
            let report = await email.send(emailAddress, "Your olowiki token", `
               <p>You olowiki token is:</p>
               <p>${token}</p>
               <p>You can copy-paste it in the olowiki app to identify yourself as ${emailAddress}</p>
            `);
            res.status(201).send();
        } catch (error) {
            res.status(500).send(error.message);
        }
    });
    
    


    // Serve the /doc store
    const docBackend = new FSBackend(Path.join(options.basePath, 'doc'));
    server.use('/doc', new HTTPBackendServer(docBackend, auth.authorization.public));


    // Serve the /lib store
    const libBackend = new FSBackend(Path.join(options.basePath, 'lib'));
    server.use('/lib', new HTTPBackendServer(libBackend, auth.authorization.public));


    // Serve the /users store
    const usersBackend = new FSBackend(Path.join(options.basePath, 'users'));
    server.use('/users', new HTTPBackendServer(usersBackend, auth.authorization.multiuser));


    // Serve the proper single-page-app on browser (not ajax) requests
    server.get(`/:store/*`, (req, res, next) => {
        if (req.path.slice(-1) === "/") {
            var html = renderTemplate(containerAppTemplate, {
                version: options.version
            })
        } else {
            var html = renderTemplate(documentAppTemplate, {
                version: options.version
            })
        }
        res.status(200).send(html);                        
    });
    
    
    // Serve test page
    server.get("/test", (req, res, next) => {
        const html = renderTemplate(testTemplate, {
            user: req.user.id
        })        
        res.status(200).send(html);                        
    });
    
    server.post("/test/init-tester-store", async (req, res, next) => {
        const content = JSON.parse(req.body);
        const testRootPath = `/${req.user.id}/olowiki-test`;
        await usersBackend.delete(testRootPath);
        for (let path in content) {
            await usersBackend.put(Path.join(testRootPath, path), content[path]);
        }
        res.status(200).send();
    });


    // Serve static files
    server.use( express.static(publicPath) );


    return server;
}
