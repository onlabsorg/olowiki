

function Value (obj) {
    const type = Value.type(obj);

    switch (type) {

        case 'Object':
            var value = {};
            for (let key in obj) {
                value[key] = Value(obj[key]);
                if (value[key] === undefined) delete value[key];
            }
            return value;

        case 'Array':
            var value = {};
            for (let i=0; i<obj.length; i++) {
                let key = String(i);
                value[key] = Value(obj[i]);
                if (value[key] === undefined) delete value[key];
            }
            return value;

        case 'Date':
            return new Date(obj.getTime());

        case 'String':
        case 'Number':
        case 'Boolean':
        case 'Null':
            return obj;

        default:
            return undefined;
    }
}



Value.type = function (obj) {
    const typeStr = Object.prototype.toString.call(obj);
    return typeStr.substring(8, typeStr.length-1);
}



module.exports = Value;
