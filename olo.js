
const port = 8080;
const rootPath = __dirname;
const storePath = "/store";

const fs = require("fs");

const jwtKey = require("./private/jwt-key");

const passport = require('passport');
const passportGoogleOpenIdConnect = require( 'passport-google-openidconnect' );
const googleClientId = JSON.parse(fs.readFileSync(`${rootPath}/private/google_client_id.json`, {encoding:'utf8'}));

const OloServer = require("./src/server");
const Store = require("./src/server/fs-store");
const store = new Store(`${rootPath}/store`, {jwtKey});

const express = require("express");
const app = express();



// prevent client access to private folder
app.all("/private/*", (req, res, next) => {
    res.status(403).send();
});



// parse the json request body
const bodyParser = require("body-parser");
app.use(bodyParser.json());



// add olo services
app.use( OloServer(store, storePath) );




// handle google openidconnect signin
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


passport.use( (function googleOpenIdConnectStrategy () {

    const options = {
        clientID: googleClientId.web.client_id,
        clientSecret: googleClientId.web.client_secret,
        callbackURL: "http://localhost:8080/auth/google/callback"
    };
    
    const callback = (iss, sub, profile, accessToken, refreshToken, done) => {
        process.nextTick(function () {   
            return done(null, {
                name: profile.displayName,
                id: profile._json.email,
                googleAccessToken: accessToken
            });
        });
    }

    return new passportGoogleOpenIdConnect.Strategy(options, callback);
    
})() );




app.use( passport.initialize() );

app.get('/auth/google', passport.authenticate('google-openidconnect', {scope: ['email', 'profile']}));

app.get('/auth/google/callback', [
    
    passport.authenticate('google-openidconnect', {
        failureRedirect: '/login', 
        session: false
    }),

    (req, res) => {
        const token = store.generateToken(req.user);                
        res.redirect(`/src/server/callback.html?user=${token}`);
    }    
]);
         

app.post('/auth/google/revoke', (req, res, next) => {
    const strategy = req._passport.instance._strategy('google-openidconnect');
    strategy.revoke( { accessToken: req.olo.user.googleAccessToken }, 
            (err, body) => res.status(200).send());
});



// serve static files
app.use(express.static(rootPath));



// start listening for HTTP requests
app.listen(port, () => {
    console.log(`olo server listening on port ${port} ...`);
});
