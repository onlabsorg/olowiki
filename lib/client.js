
const olojs = require("olojs");
const HTTPStoreClient = require("http-store/lib/http-store-client");


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


class HTTPStore extends HTTPStoreClient {
    
    constructor (storeURL) {
        super(storeURL, {
            cache: true,
            auth: ""
        })
    }    
    
    get authorizationHeader () {
        let token = exports.getToken();
        return `Bearer ${token}`;
    }
    
    set authorizationHeader (auth) {}
}


// HUB
const context = require("./context");
const hub = new olojs.Hub({}, context);

// bin store
const marked = require("marked");
const binStore = require("./bin-store/index");
hub.mount(`${location.origin}/bin`, binStore);

// doc store
const docStore = new HTTPStore(`${location.origin}/doc`);
hub.mount(`${location.origin}/doc`, docStore);

// lib store
const libStore = new HTTPStore(`${location.origin}/lib`);
hub.mount(`${location.origin}/lib`, libStore);

// lib store
const usersStore = new HTTPStore(`${location.origin}/users`);
hub.mount(`${location.origin}/users`, usersStore);

// LocalStore
const PouchdbStore = require("./pouchdb-store");
const localStore = new PouchdbStore("local-store");
hub.mount(`${location.origin}/local`, localStore);


// olowiki root
const rootStore = {
    async read (path) {
        if (path === "/") return `<% items = ["bin/", "doc/", "lib/", "rs/", "tmp/"] %>`;
        else if (path.slice(-1) === "/") return `<% items = [] %>`;
        else return "";
    },
    async write (path, source) {
        throw new olojs.errors.WriteAccessDenied(path);
    },
    async delete (path) {
        throw new olojs.errors.WriteAccessDenied(path);
    }
};
hub.mount(`${location.origin}/`, rootStore);

// http and https stores
hub.mount("https:/", new HTTPStoreClient("https:/", {cache:true}));
hub.mount("http:/",  new HTTPStoreClient("http:/",  {cache:true}));



// API

exports.createDocument = function (path, source) {
    const uri = new URL(path, location.href);
    return hub.create(uri.href, source);
}

exports.readDocument = async function (path) {
    const uri = new URL(path, location.href);
    return await hub.read(uri.href);
}

exports.writeDocument = async function (doc) {
    return await hub.write(doc.uri, doc.source);
}

exports.deleteResource = async function (path) {
    const uri = new URL(path, location.href);
    return await hub.delete(uri.href);
}

exports.errors = olojs.errors;
