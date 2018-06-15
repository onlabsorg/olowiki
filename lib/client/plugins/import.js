
const olo = window.olo;

module.exports = function (store) {
    
    olo.Document.registerTag('import', {
        type: "void",
        decorator: (element) => {
            const importElt = Object.create(element);
            importElt.attributes.sanitize(['href','name']);
            
            importElt.toString = () => "";
            
            importElt.render = async function (context) {
                await element.render(context);
                const targetDoc = await store.getDocument(this.attributes.get("href"));
                const targetScope = {};
                await targetDoc.renderTemplate(targetScope);
                context[this.attributes.get("name")] = targetScope;                            
            }
            
            return importElt;
        }
    });    
}
