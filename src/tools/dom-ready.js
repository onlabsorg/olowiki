
module.exports = function () {
    return new Promise( (resolve, reject) => {
        document.addEventListener("DOMContentLoaded", resolve);
    });
}
