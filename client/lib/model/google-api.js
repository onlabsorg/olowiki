
const clientId = "94417044015-pqcmhacavdju3blcd94m6t4ucd17gsfr.apps.googleusercontent.com";
const clientSecret = "OBU5Iiilj2EUGjS5fFhhryjU";

const mimeType = "application/olo";



const loadedLibs = new Set();

async function requireGAPI () {
    if (!window.gapi) {
        await loadScript("https://apis.google.com/js/api.js");
        await gload("auth:client,drive-realtime,drive-share");
    }
    return window.gapi;
}

function loadScript (src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.type = "text\/javascript";
        script.onerror = reject;
        script.onload = resolve;
        document.head.appendChild(script);
        script.src = src;
    });
}

function gload (name) {
    return new Promise((resolve, reject) => {
        window.gapi.load(name, {
            callback: resolve,
            onerror: reject
        });
    });
}




module.exports = {

    createInMemoryDocument: async function () {
        const gapi = await requireGAPI();
        return gapi.drive.realtime.newInMemoryDocument();
    },

    authorize: async function (clientId, usePopup=true) {
        const gapi = await requireGAPI();
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
        const gapi = await requireGAPI();
        const doc = await new Promise((resolve, reject) => {
            gapi.drive.realtime.load(docId, resolve, () => {}, reject);
        });
        return doc;
    },

    createDocument: async function (title) {
        const gapi = await requireGAPI();
        await new Promise((resolve, reject) => gapi.client.load('drive', 'v2', resolve));
        const docHash = {
            resource: {
                mimeType: mimeType,
                title: title
            }
        }
        const resource = await new Promise((resolve, reject) => gapi.client.drive.file.insert(docHash).execute(resolve));
        return resource;
    }
}
