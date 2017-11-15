
const grequire = require("utils/grequire");

const clientId = "94417044015-pqcmhacavdju3blcd94m6t4ucd17gsfr.apps.googleusercontent.com";
const clientSecret = "OBU5Iiilj2EUGjS5fFhhryjU";


module.exports = {

    createInMemoryDocument: async function () {
        const gapi = await grequire("auth:client", "drive-realtime", "drive-share");
        return gapi.drive.realtime.newInMemoryDocument();
    },

    authorize: async function (clientId, usePopup=true) {
        const gapi = await grequire("auth:client");
        const options = {
            client_id: clientId,
            scope: [
                'https://www.googleapis.com/auth/drive.install',
                'https://www.googleapis.com/auth/drive.file'
            ],
            immediate: !usePopup
        };
        const token = await new Promise((resolve, reject) => {
            gapi.auth.authorize(options, (authResult) => {
                if (authResult && !authResult.error) resolve(authResult.access_token);
                else reject(authResult.error);
            });
        });
        return token;
    },

    loadDocument: async function (docId) {
        const gapi = await grequire("drive-realtime", "drive-share");
        const doc = await new Promise((resolve, reject) => {
            gapi.drive.realtime.load(docId, resolve, () => {}, reject);
        });
        return doc;
    }
}
