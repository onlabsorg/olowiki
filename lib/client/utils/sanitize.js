const sanitizeHTML = require("sanitize-html");



/**
 *  This function returns a sane HTML murkup give a white-list of allowed tags.
 *
 *  The white list is a map of items with the following format
 *
 *  {
 *      ...
 *      allowedTag: [allowedAttr-1, allowedAttr-2, ... , '<>', "allowedScheme-1:", "allowedScheme-2:"],
 *      ...
 *  }
 *
 * allowedAttr-i        is an allowed attribute
 *
 * '<>'                 indicate that the tag is self-closing
 *
 * allowedScheme-i:     is a scheme (http:,https:,ftp:,...) that is allowed
 *                      for attributes like src and href
 */
module.exports = function (html, allowedTags) {

    var allowedTags = allowedTags;

    var parsedTags = {
        allowedTags: [],
        allowedAttributes: {},
        selfClosing: [],
        allowedSchemes: [],
        allowedSchemesByTag: {}
    }

    var defaultAttributes = allowedTags['*'] || [];

    for (let tag in allowedTags) {
        if (tag === '*') continue;

        let attributes = allowedTags[tag];
        if (attributes === true) attributes = [];
        if (!Array.isArray(attributes)) continue;

        parsedTags.allowedTags.push(tag);
        parsedTags.allowedAttributes[tag] = [];
        parsedTags.allowedSchemesByTag[tag] = [];

        for (let item of defaultAttributes.concat(attributes)) {

            // sefl-closing option
            if (item === '<>') {
                parsedTags.selfClosing.push(tag);
            }

            // schemes
            else if (item[item.length-1] === ":") {
                let scheme = item.slice(0, item.length-1);
                parsedTags.allowedSchemesByTag[tag].push(scheme);
            }

            // attributes
            else {
                parsedTags.allowedAttributes[tag].push(item);
            }
        }
    }

    return sanitizeHTML(html, parsedTags);
}
