module.exports = function (Document) {
    Document.Element.decorators.set('set', (element) => {
        const setElt = Object.create(element);
        
        setElt.toString = setElt.toHTML = () => "";
        
        setElt.render = async function (context) {
            await this.attributes.render(context);
            for (let [key, value] of this.attributes) {
                context[key] = value;
            }
        }
        
        return setElt;
    });
}
