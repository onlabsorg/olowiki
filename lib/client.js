
const olojs = require("olojs");
const HTTPBackendClient = require("olojs/lib/backends/http-backend-client");


exports.getToken = function () {
    return localStorage.getItem("token") || ""
}

exports.setToken = function (token) {
    localStorage.setItem("token", token);
}

exports.getUser = async function () {
    const token = this.getToken();
    const response = await fetch("/user", {
        method: 'get',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    if (response.status === 200) {
        let user = await response.json();
        return user.id;        
    } else {
        return "Guest";
    }
}

exports.requestToken = async function (userId) {
    const response = await fetch("/user", {
        method: 'post',
        headers: {},
        body: String(userId)
    });
    
    if (!response.ok) {
        let message = await response.text();
        throw new Error(message);        
    }
}


class OlowikiStore extends olojs.Store {
    
    static get Document () {
        return OlowikiDocument;
    }
}


class OlowikiDocument extends olojs.Store.Document {
    
    createContext (globals={}) {
        var olowikiGlobals = {};
        Object.assign(olowikiGlobals, globals);
        globals.Error = function (error) {
            console.error(error);
            return {
                message: error.message,
                __text__ () {
                    return `<strong style="color:red">ERROR: ${error.message}</strong>`;
                }
            }
        }        
        const context = super.createContext(globals);
        context.license = "https://opensource.org/licenses/MIT";
        return context;
    }
}


class HTTPBackend extends HTTPBackendClient {
    
    constructor (backendURL) {
        super(backendURL, {
            cache: true,
            auth: ""
        });
    }    
    
    get authorizationHeader () {
        let token = exports.getToken();
        return `Bearer ${token}`;
    }
    
    set authorizationHeader (auth) {}
}

class HTTPStore extends OlowikiStore {
    
    constructor (storeURL) {
        const backend = new HTTPBackend(storeURL);
        super(storeURL, backend);
    }
}



// HUB
const hub = new olojs.Hub();

// bin store
const marked = require("marked");
const binBackend = require("./bin-backend/index");
const binStore = new OlowikiStore(`${location.origin}/bin`, binBackend);
hub.mount(binStore);

// doc store
const manStore = new HTTPStore(`${location.origin}/man`);
hub.mount(manStore);

// doc store
const docStore = new HTTPStore(`${location.origin}/doc`);
hub.mount(docStore);

// lib store
const libStore = new HTTPStore(`${location.origin}/lib`);
hub.mount(libStore);

// lib store
const usersStore = new HTTPStore(`${location.origin}/users`);
hub.mount(usersStore);

// LocalStore
const PouchdbBackend = require("./pouchdb-backend");
const pouchdbBackend = new PouchdbBackend("local-store");
const localStore = new OlowikiStore(`${location.origin}/local`, pouchdbBackend);
hub.mount(localStore);

// http and https stores
hub.mount(new HTTPStore("https:/", {cache:true}));
hub.mount(new HTTPStore("http:/",  {cache:true}));



// API

exports.create = function (path, source) {
    const uri = new URL(path, location.href);
    return hub.create(uri.href, source);
}

exports.read = async function (path) {
    const uri = new URL(path, location.href);
    return await hub.read(uri.href);
}

exports.write = async function (path, data) {
    const uri = new URL(path, location.href);
    return await hub.write(uri.href, data);
}

exports.delete = async function (path) {
    const uri = new URL(path, location.href);
    return await hub.delete(uri.href);
}

exports.errors = olojs.errors;
