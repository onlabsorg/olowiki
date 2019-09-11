
const olojs = require("olojs");

const bin = {
    "/math": () => import(/* webpackChunkName: "/bin_math" */ './math'),
    "/text": () => import(/* webpackChunkName: "/bin_text" */ './text'),
    "/list": () => import(/* webpackChunkName: "/bin_list" */ './list'),
    "/markdown": () => import(/* webpackChunkName: "/bin_markdown" */ './markdown'),
}


exports.read = async function (path) {
    if (path.slice(-1) === "/") {
        let items = path !== "/" ? [] : Object.keys(bin).map(path => path.slice(1));
        return `<% items = ${JSON.stringify(items)} %>`;
    } else {
        let load = bin[path];
        return load ? await load() : "";
    }
}

exports.write = async function (path, source) {
    if (path.slice(-1) === "/") {
        throw new olojs.errors.WriteOperationNotAllowed(path);
    } else {
        throw new olojs.errors.WriteAccessDenied(path);
    }
}

exports.delete = async function (path) {
    throw new olojs.errors.WriteAccessDenied(path);
}
