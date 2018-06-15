
const olo = window.olo;

module.exports = function (store) {
    
    olo.Document.registerTag('import', {
        type: "void",
        decorator: (element) => {
            const importElt = olo.Document.Sanitizer(['href','name'], true)(element);
            
            importElt.toString = () => "";
            
            importElt.render = async function (context) {
                await element.render(context);
                const targetDoc = await store.getDocument(this.attributes.href);
                const targetScope = {};
                await targetDoc.renderTemplate(targetScope);
                context[this.attributes.name] = targetScope;                            
            }
            
            return importElt;
        }
    });    
}
