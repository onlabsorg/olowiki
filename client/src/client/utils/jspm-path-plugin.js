/**
 *  Address plugin
 *  Returns the address of a jspm module
 */

exports.fetch = function () {
    return new Promise((resolve, reject) => resolve(""));
}

exports.translate = function(load) {
  load.metadata.format = 'cjs';
  return `module.exports = "${load.address}";`;
}
