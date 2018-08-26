

const express = require("express");
const passport = require('passport');
const passportGoogleOpenIdConnect = require( 'passport-google-openidconnect' );

const jwt = require("jsonwebtoken");



function Router (googleClientSecret, jwtKey) {
    const router = express.Router();
    
    router.all(`*`, (req, res, next) => {
        const auth = req.get('Authorization');
        
        if (auth && auth.substr(0,7) === "Bearer ") {
            req.userToken = auth.substr(7);
        } else {
            req.userToken = req.query.user;
        }
        
        try {
            req.user = jwt.verify(req.userToken, jwtKey) || {};
        } catch (error) {
            req.user = {};
        }
        
        next();        
    });
    
    // handle google openidconnect signin
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });


    passport.use( (function googleOpenIdConnectStrategy () {

        const options = {
            clientID: googleClientSecret.web.client_id,
            clientSecret: googleClientSecret.web.client_secret,
            callbackURL: googleClientSecret.web.redirect_uris[0]
        };
        
        const callback = (iss, sub, profile, accessToken, refreshToken, done) => {
            process.nextTick(function () {   
                const user = {
                    name: profile.displayName,
                    email: profile._json.email,
                    googleAccessToken: accessToken
                }; 
                return done(null, user);
            });
        }

        return new passportGoogleOpenIdConnect.Strategy(options, callback);
        
    })() );

    router.use( passport.initialize() );

    router.get('/auth/google', passport.authenticate('google-openidconnect', {scope: ['email', 'profile']}));

    router.get('/auth/google/callback', [
        
        passport.authenticate('google-openidconnect', {
            failureRedirect: '/login', 
            session: false
        }),

        (req, res) => {
            const token = jwt.sign(req.user, jwtKey);                
            res.redirect(`/lib/server/callback.html?user=${token}`);
        }    
    ]);
             

    router.post('/auth/google/revoke', (req, res, next) => {
        const strategy = req._passport.instance._strategy('google-openidconnect');
        strategy.revoke( { accessToken: req.user.googleAccessToken }, 
                (err, body) => res.status(200).send());
    });

    return router;
}



module.exports = Router;
