const Environment = olojs.require(`environment`);
const FSStore = olojs.require(`stores/fs-store`);
const HTTPServer = olowiki.require("http-server");

const EMailDispatcher = olowiki.require(`dispatchers/email`);
// const GmailDispatcher = olowiki.require(`dispatchers/gmail`);


module.exports = new Environment({
    
    store: new FSStore(`${__dirname}/docs`),

    nocache: true,
        
    globals: {
        require: modulePath => olojs.require(`stdlib/${modulePath}`)
    },

    serve: HTTPServer({

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
        
        /** 
         *  In case you want to use gmail to send tokens,
         *  use GMailDispatcher = require("../lib/dispatchers/gmail") instead
         *  and fill in the following fields; otherwise delete them.
         */
        // dispatch: GmailDispatcher({
        //     from: "...",     // the sender email address
        //     credentials: {}, // the credentials object obtained when activating the gmail API in your gmail account
        //     token: "..."     // the token obtained after authorizing the app
        // })
    }),
    

});
