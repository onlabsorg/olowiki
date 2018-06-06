

module.exports = function () {
    return new Promise((resolve, reject) => {
        if (document.body) resolve();
        else document.addEventListener("DOMContentLoaded", event => resolve());
    });    
}
