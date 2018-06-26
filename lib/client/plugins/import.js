const olo = window.olo;

module.exports = function (store, auth) {
    olo.Document.decorators.set("import", olo.Document.Element.Loader(
            href => store.readDocument(href, auth.getToken() )));
}
