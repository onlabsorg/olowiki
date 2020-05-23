const Environment = require(`@onlabsorg/olojs/lib/environment`);
const FSStore = require(`@onlabsorg/olojs/lib/stores/fs-store`);
const HTTPServer = require("@onlabsorg/olowiki/lib/http-server");

const EMailDispatcher = require(`@onlabsorg/olowiki/lib/dispatchers/email`);


module.exports = new Environment({
    
    store: new FSStore(`${__dirname}/documents`),

    nocache: true,
        
    globals: {
        require: modulePath => require(`@onlabsorg/olowjs/lib/stdlib/${modulePath}`)
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
         *  use GmailDispatcher = require("@onlabsorg/olowiki/lib/dispatchers/gmail") instead
         *  and fill in the following fields.
         */
        // dispatch: GmailDispatcher({
        //     from: "...",     // the sender email address
        //     credentials: {}, // the credentials object obtained when activating the gmail API in your gmail account
        //     token: "..."     // the token obtained after authorizing the app
        // })
    }),
});