
const olo = window.olo;

module.exports = function (store) {
    
    olo.Document.defineTag('import', {
        
        type: 'void',
        
        allowedAttributes: [ 'href', 'name' ],
        
        async decorator (scope) {
            const targetDoc = await store.getDocument(this.attributes.href);
            const targetScope = {};
            await targetDoc.renderTemplate(targetScope);
            scope[this.attributes.name] = targetScope;
            return "";
        }
    });
}
