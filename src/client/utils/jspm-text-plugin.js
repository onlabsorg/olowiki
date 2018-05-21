/**
 *  Text plugin
 */
exports.translate = function(load) {
  load.metadata.format = 'cjs';
  return `module.exports = ${JSON.stringify(load.source)};`;
}
