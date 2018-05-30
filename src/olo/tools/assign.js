
module.exports = function (scope, path, value) {
    const pathNames = path.split(".");
    const key = pathNames.pop();
    var obj = scope;
    for (let name of pathNames) {
        obj = obj[name];
    }
    obj[key] = value;
}    
