const Environment = olowiki.require(`backend-environment`);
const FSStore = olojs.require(`stores/fs-store`);
const Router = olojs.require('stores/router');
const EMailDispatcher = olowiki.require(`dispatchers/email`);
// const GmailDispatcher = olowiki.require(`dispatchers/gmail`);


module.exports = new Environment({
    
    store: new Router({
        "/"              : new FSStore(`${__dirname}/public`),
        "/documentation" : new FSStore(`${__dirname}/public/documentation`),
        "/projects"      : new FSStore(`${__dirname}/public/projects`),
        "/contributors"  : new FSStore(`${__dirname}/public/contributors`),        
    }),

    // // Customize the access control.
    // // This function accepts an (express) HTTP request object and should return
    // // `true` to allow it adn `false` to deny it.
    // allow: function (req) {},
    
    nocache: true,
    
    owner  : "<% owner %>",
    secret : "<% secret %>",

    dispatch: EmailDispatcher({        
        host: "...",    // e.g. smtp.mail.yahoo.com; check your e-mail provider for the host name
        port: 465,      // ask your e-mail provider
        secure: true,   // true for port 465, false for other ports
        auth: {
            user: "...",   // your e-mail user id
            pass: "..."    // your e-mail password
        },
    }),
    

    // // in case you want to use gmail to send tokens, set
    // // EMailDispatcher = retuire("../lib/dispatchers/gmail") 
    // // instead and fill in the following fields; otherwise delete them
    // // do not forget to activate the "less secure app" option in your gmail settings
    // dispatch: GmailDispatcher({
    //     from: "...",     // the sender email address
    //     credentials: {}, // the credentials object obtained when activating the gmail API in your gmail account
    //     token: "..."     // the token obtained after authorizing the app
    // })
});
