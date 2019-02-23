/**
 * ------------------------------------------------------------------------
 *  OLOWIKI SERVER
 * ------------------------------------------------------------------------
 *  The Server function returned by this module creates an express app
 *  that can be started with:
 *
 *      server.listen(port, callback)
 *
 *  The server function takes an options object as parameter.
 *  The content of the options object is described below:
 *      
 *      options.secret:
 *          a string containing a key to be used for JWT encryption
 *      
 *      options.route: 
 *          the mounth path of the store
 *          if, for example, route is "/mystore", a store document will be
 *          accessible at the URL: https://hostname/mystore/documentname
 *
 *      options.path: 
 *          location on disk of the directory containing the documents
 *
 *      options.basePath:
 *          options.path can be relative to this path
 *
 * ------------------------------------------------------------------------
 */



const Path = require("path");
const fs = require("fs");
const express = require('express');
const rootPath = Path.resolve(__dirname, "..");
const publicPath = `${rootPath}/public`;
const dataBrowserPath = `${publicPath}/index.html`;
const clientHTMLPage = fs.readFileSync(dataBrowserPath, {encoding:'utf8'});
const HTTPStoreServer = require("olo-store/lib/http-store-server");
const FSBackend = require("olo-store/lib/fs-backend");
const Auth = require("./auth");



module.exports = function Server (options={}) {    
    const server = express();  


    /**
     * ------------------------------------------------------------------------
     *  On GET /version requests,
     *  return the app version number.
     * ------------------------------------------------------------------------
     */
    server.get("/version", (req, res, next) => {
        res.status(200).send(options.version);
    });
    
    
    /**
     * ------------------------------------------------------------------------
     *  AUTHENTICATION MIDDLEWARE
     * ------------------------------------------------------------------------
     *  Each request should have an Authoriztion HTTP header of the type:
     *
     *      Bearer <JWT-TOKEN>
     *
     *  For each request, this middleware verifies the JWT token against the
     *  secrete key passed as second argumento of the constructor.
     *  If the token is valid, its content is taken as the user id and 
     *  assigned to req.userId as prove of the successfull authentication.
     * ------------------------------------------------------------------------
     *  In order to obtain a token, the user should send a POST request
     *
     *      POST /user/token
     *
     *  containing his email address as body.
     *  The middleware will then send a valid JWT token to the given e-email
     *  address. The user id contained in the JWT token is the e-mail address.
     * ------------------------------------------------------------------------
     *  If the client has a JWT token and wants to know the e-mail address in
     *  it, he can send the following request
     *
     *      GET /user/verify
     *
     *  attaching the JWT token to the Authorization header as shown above.
     * ------------------------------------------------------------------------
     */
     server.use( Auth("/user", options.secret) );
     
     
    /**
     * ------------------------------------------------------------------------
     *  STORE MIDDLEWARE
     * ------------------------------------------------------------------------
     *  For each store configuration object contained in the array options.stores,
     *  create a separate store middleware, serving CRUD oloml documents
     *  access from the route opt.route.
     * ------------------------------------------------------------------------
     */
    let backend = new FSBackend( Path.resolve(options.basePath, options.path) );
    let store = new HTTPStoreServer(backend);
    
    server.use(options.route, store);
    
    server.get(`${options.route}/*`, (req, res, next) => {
        res.status(200).send(clientHTMLPage);
    });        


    /**
     * ------------------------------------------------------------------------
     *  Serve static files.
     * ------------------------------------------------------------------------
     */
    server.use( express.static(publicPath) );


    return server;
}
