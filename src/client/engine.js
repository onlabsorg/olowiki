
const Handlebars = require('handlebars');
const marked = require("marked");
const sanitize = require("utils/sanitize");

const store = require("./store");

const getOwnProperties = require("utils/get-own-properties");



exports.render = async function (docData, context) {
    const rendering = {};
    
    for (let section of docData.sections) {
        let scope = Object.create(context);                    
        rendering[section.name] = await renderTemplate(section.template, scope);
        context[section.name] = getOwnProperties(scope);            
    }
    
    return rendering;            
}



async function renderTemplate (template, scope) {
    const config = exports.config;
    
    // resolve import statements
    const importStatements = [];
    template = template.replace(/\{\{\s*import\s*(.+)\s+as\s+([a-zA-Z0-9_]+)\s*\}\}/gm, (match, url, name) => {
        importStatements.push({url, name});
        return "";
    });
    for (let importStatement of importStatements) {
        let importedDoc = await store.read(importStatement.url);
        let importedContext = scope[importStatement.name] = {};
        let rendering = await exports.render(importedDoc, importedContext);
    }

    // resolve assignment syntax
    template = template.replace(/\{\{\s*([a-zA-Z_]+)\s*=\s*(.+)\s*\}\}/gm, (match, name, value) => {
        return `{{set "${name}" ${value}}}`
    });
    
    // render handlebars template
    const handlebars = Handlebars.create();
    handlebars.registerHelper(config.handlebarsHelpers);
    handlebars.registerPartial(config.handlebarsPartials);
    handlebars.registerDecorator(config.handlebarsDecorators);
    const renderTemplate = handlebars.compile(template, config.handlebarsOptions);    
    const markdown = renderTemplate(scope);        
    
    // render markdown
    const html = marked(markdown, config.markdownOptions);
    
    // sanitize and return
    return sanitize(html, config.allowedTags);                
}



exports.config = {
    
    handlebarsOptions: {
        noEscape: true
    },

    handlebarsHelpers: {
        set: function (name, value) {
            this[name] = value;
            return "";
        }
    },

    handlebarsPartials: {},

    handlebarsDecorators: {},

    markdownOptions: {},

    allowedTags: {
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
       'olo-link': ['href']
    }    
}
