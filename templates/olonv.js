const Environment = require(`${__olowikipath}/lib/backend-environment`);
const FSStore = require(`${__olojspath}/lib/environment/fs-store`);
const EMailDispatcher = require(`${__olowikipath}/lib/dispatchers/email`);


module.exports = new Environment({
    
    paths: {
        "/"        : FSStore.createReader(`${__dirname}/public`),
        "/doc"     : new FSStore(`${__dirname}/public/doc`),
        "/lib"     : new FSStore(`${__dirname}/public/lib`),
        "/users"   : new FSStore(`${__dirname}/public/users`)
    },
    
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
