module.exports = function (Document, load) {
    Document.Element.decorators.set("import", (element) => {
        const importElt = Object.create(element);
        importElt.attributes.sanitize(['href','name']);
        
        importElt.toString = importElt.toHTML = () => "";
        
        importElt.render = async function (context) {
            await element.render(context);
            const targetDoc = await load(this.attributes.get("href"));
            const targetScope = {};
            await targetDoc.render(targetScope);
            context[this.attributes.get("name")] = targetScope;
        }
        
        return importElt;        
    });
}
