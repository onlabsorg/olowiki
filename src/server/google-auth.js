

const express = require("express");
const passport = require('passport');
const passportGoogleOpenIdConnect = require( 'passport-google-openidconnect' );

const Token = require("../olo/tools/token");



function Router (googleClientSecret, jwtSecret) {
    const router = express.Router();

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
                return done(null, {
                    name: profile.displayName,
                    id: profile._json.email,
                    googleAccessToken: accessToken
                });
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
            const token = Token.sign(req.user, jwtSecret);                
            res.redirect(`/src/server/callback.html?user=${token}`);
        }    
    ]);
             

    router.post('/auth/google/revoke', (req, res, next) => {
        const strategy = req._passport.instance._strategy('google-openidconnect');
        strategy.revoke( { accessToken: req.olo.user.googleAccessToken }, 
                (err, body) => res.status(200).send());
    });

    return router;
}



module.exports = Router;
