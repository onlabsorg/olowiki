
const olo = window.olo;

module.exports = function (store) {
    
    olo.Document.defineTag('import', {
        
        type: 'void',
        
        allowedAttributes: [ 'href', 'name' ],
        
        async decorator (context) {
            const targetDoc = await store.getDocument(this.attributes.href);
            const targetScope = {};
            await targetDoc.renderTemplate(targetScope);
            context[this.attributes.name] = targetScope;
            return "";
        }
    });
}
