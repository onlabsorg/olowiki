module.exports = function (Document) {
    Document.decorators.set('set', (element) => {
        const setElt = Object.create(element);
        
        setElt.toString = () => "";
        
        setElt.render = async function (context) {
            await this.attributes.render(context);
            for (let [key, value] of this.attributes) {
                context[key] = value;
            }
        }
        
        return setElt;
    });
}
