

module.exports = function (href) {
    const anchor = document.createElement('a');
    anchor.href = href;
    return anchor;
}
