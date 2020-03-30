
const {google} = require('googleapis');
const Base64 = require('js-base64').Base64;

const SCOPES = [
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/gmail.send'];


// Create a GMail sender given the following options:
// - options.from: email address of the sender
// - options.credentials: Google credentials downloaded when activating the gmail API
// - options.token: generated code. if you don't have a code, run node gmail get-token at the command-line
function Dispatcher (options) {
    
    // get authorization
    const oauth2Client = authorize(options.credentials);
    oauth2Client.setCredentials(options.tokens);

    // create glmail client
    const gmail = google.gmail({version:'v1', auth:oauth2Client});

    // create and return the dispatcher
    return async function (to, subject, message) {
        return await gmail.users.messages.send({
            userId: 'me',
            resource: {
                raw: createEmail(options.from, to, subject, message)
            }            
        });
    }
}


// Returns an URL that you should visit to authorize the app and
// obtain the authorization token
Dispatcher.getNewAuthURL = function (credentials) {
    const oauth2Client = authorize(credentials)
    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
};


// Generate the tokens based on the code obtained in the browser
Dispatcher.getTokens = async function (credentials, code) {
    const oauth2Client = authorize(credentials)
    const {tokens} = await oauth2Client.getToken(code);
    return tokens;
};


// Generate the OAuth2 authorization object
function authorize (credentials) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    return new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);                
}


// Build an email as an RFC 5322 formatted, Base64 encoded string
function createEmail (from, to, subject, message) {
    let email = [
        "Content-Type: text/html; charset=\"UTF-8\"\n",
        "MIME-Version: 1.0\n",
        "Content-Transfer-Encoding: 7bit\n",
        "to: ", to, "\n",
        "from: ", from, "\n",
        "subject: ", subject, "\n\n",
        message
    ].join('');

    return Base64.encodeURI(email);
}


module.exports = Dispatcher;
