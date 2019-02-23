
const stores = new Map();

exports.mount = async function (name, store) {
    stores.set(name, store);
}


exports.signin = async function (uri) {} 


exports.read = async function (uri) {}


exports.write = async function (uri, source) {}


exports.signout = async function (uri) {}
