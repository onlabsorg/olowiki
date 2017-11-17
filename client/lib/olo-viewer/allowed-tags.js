module.exports = {
    '*': [ 'http:', 'https:', 'ftp:', 'mailto:', 'class', 'style', 'id', 'slot' ],

    // headers
    'h1': [],
    'h2': [],
    'h3': [],
    'h4': [],
    'h5': [],
    'h6': [],

    // lists
    'ul': [],
    'ol': [ 'type', 'start' ],
    'li': [],
    'dl': [],
    'dt': [],
    'dd': [],

    // tables
    'table': [],
    'thead': [],
    'tbody': [],
    'tfoot': [],
    'caption': [],
    'col': [],
    'colgroup': [],
    'tr': [],
    'th': [],
    'td': [],

    // misc block tags
    'p': [],
    'blockquote': [],
    'pre': [],
    'div': [],
    'br': [ '<>' ],
    'hr': [ '<>' ],

    // inline tags
    'b': [],
    'i': [],
    'strong': [],
    'em': [],
    'code': [],
    'a': [ 'href', 'name', 'target' ],
    'img': [ 'src', 'alt', 'height', 'width' , '<>' , "http:"],

    // olo-elements
    'olo-viewer': ['href'],
};
