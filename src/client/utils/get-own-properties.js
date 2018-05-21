

module.exports = function (obj) {
    const ownProperties = {};
    for (let name of Object.getOwnPropertyNames(obj)) {
        ownProperties[name] = obj[name];
    }
    return ownProperties;
}
