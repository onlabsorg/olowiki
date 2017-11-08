



function Feature () {
    var res, rej;
    const promise = new Promise((resolve, reject) => {
        res = resolve;
        rej = reject;
    });
    promise.resolve = function (value) {
        res(value);
    }
    promise.reject = function (error) {
        rej(error);
    }
    return promise;
}


module.exports = Feature;
