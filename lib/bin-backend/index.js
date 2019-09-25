
const olojs = require("olojs");

const bin = {
    "/math": () => import(/* webpackChunkName: "/bin/math" */ './math'),
    "/text": () => import(/* webpackChunkName: "/bin/text" */ './text'),
    "/list": () => import(/* webpackChunkName: "/bin/list" */ './list'),
    "/markdown": () => import(/* webpackChunkName: "/bin/markdown" */ './markdown'),
}


exports.get = async function (path) {
    const load = bin[path];
    return load ? await load() : "";
}

exports.list = async function (path) {
    return path !== "/" ? [] : Object.keys(bin).map(path => path.slice(1));    return `<% items = ${JSON.stringify(items)} %>`;    
}

exports.put = async function (path, body) {
    throw new olojs.errors.WriteAccessDenied(path);
}

exports.delete = async function (path) {
    throw new olojs.errors.WriteAccessDenied(path);
}
