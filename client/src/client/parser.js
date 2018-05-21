
const uuid = require("utils/uuid");
const unindent = require("utils/unindent");


exports.parseDOM = function (domRoot) {
    const titleElt = domRoot.querySelector("title");
    const metaAuthorElt = domRoot.querySelector('meta[name="author"]');
    const sectionElts = domRoot.querySelectorAll('template[type="section"]');

    return {
        
        title: titleElt ? titleElt.innerHTML : "New document",
        
        author: metaAuthorElt ? metaAuthorElt.getAttribute("content") : undefined,
        
        sections: Array.from(sectionElts).map(sectionElt => {
            const fragment = sectionElt.content.cloneNode(true);
            const container = document.createElement('script');
            container.setAttribute("type", "plain/text");
            container.appendChild(fragment);
            const importElts = container.querySelectorAll('import');

            return {
                id: uuid(),
                name: sectionElt.getAttribute("name"),
                title: sectionElt.getAttribute("title"),
                template: unindent(container.innerHTML),
                display: {
                    collapsed: sectionElt.hasAttribute("collapsed"),
                    hidden: sectionElt.hasAttribute("hidden"),
                    editMode: false
                }
            }
        })
    };
}


exports.parseHTML = function (html) {
    const domRoot = document.createElement("div");
    domRoot.innerHTML = html;
    return this.parseDOM(domRoot);
}
