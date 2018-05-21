
const URL = require("utils/url");
const queryString = require("utils/query-string");

const parser = require("./parser");


const docCache = new Map();



exports.read = async function (href) {    
    const url = URL(href);
    const docURL = url.origin + url.pathname;

    if (docCache.has(docURL)) {
        return docCache.get(docURL);
    }
    
    const response = await fetch(docURL);
    const html = await response.text();
    return parser.parseHTML(html);
}



exports.write = async function (href, docData) {
    const token = getToken();
    const url = URL(href);
    const response = await fetch(url.pathname, {
        method: 'put',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',                
        },
        body: JSON.stringify(docData)
    });
    if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
    }    
}



exports.clearCache = function () {
    docCache.clear();
}




exports.signin = async function () {
    localStorage.setItem('callbackURL', location.origin + location.pathname);
    const anchor = document.createElement('a');
    anchor.href = "/auth/google";
    anchor.click();
}



exports.getUser = async function () {
    const token = getToken();
    
    const response = await fetch('/user', {
        method: 'get',
        headers: {
            'Authorization': `Bearer ${token}`,            
        }
    });
    if (!response.ok) {
        let err = await response.text();
        throw new Error(err);
    }
    else {
        let user = await response.json();
        return user;
    }
}



exports.signout = async function () {
    const token = getToken();
    
    const response = await fetch('/auth/google/revoke', {
        method: 'post',
        headers: {
            'Authorization': `Bearer ${token}`,            
        }
    });
    if (!response.ok) {
        let err = await response.text();
        throw new Error(err);
    }
    location.href = location.origin + location.pathname;
}



function getToken () {
    const query = queryString.parse(location.search);
    return query.user;
}
