function keyString (event) {
    var metaKeys,key;

    metaKeys = (event.altKey ? "alt-" : "") +
               (event.ctrlKey ? "ctrl-" : "") +
               (event.shiftKey ? "shift-" : "");

    // letter or digit
    if ((event.which >= 48 && event.which <= 57) || (event.which >= 65 && event.which <= 90)) {
        key = String.fromCharCode(event.which).toLowerCase();
    }

    // special keys
    else switch (event.which) {
        case  9: key = "tab"; break;
        case 13: key = "enter"; break;
        case 27: key = "esc"; break;
        case 32: key = "space"; break;
        case 37: key = "left"; break;
        case 38: key = "up"; break;
        case 39: key = "right"; break;
        case 40: key = "down"; break;
        case 46: key = "canc"; break;
        default: key = event.which;
    };

    return metaKeys+key;
}

module.exports = keyString;
