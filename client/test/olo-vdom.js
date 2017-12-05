const OloComponent = require("olo-component");
const OloVDOM = require("olo-vdom");

const h = require("virtual-dom/h");



suite("<olo-vdom>", () => {
    const testFrame = document.querySelector("#test-frame");

    test(".updateView() should update the shadowDom with the VTree returned by .render()", () => {
        testFrame.innerHTML = "<olo-vdom></olo-vdom>";
        var elt = testFrame.querySelector('olo-vdom');

        elt.render = () => h('div', {id:"t1"}, "Testing ...");
        elt.updateView();
        const div = elt.$("vdom").firstChild;
        expect(div.tagName).to.equal('DIV');
        expect(div.id).to.equal("t1");
        expect(div.textContent).to.equal("Testing ...");

        elt.render = () => h('div', {id:"t2"}, "Testing ... ...");
        elt.updateView();
        expect(elt.$("vdom").firstChild).to.equal(div);
        expect(div.id).to.equal("t2");
        expect(div.textContent).to.equal("Testing ... ...");

        elt.render = () => h('div', {}, "Testing ... ... ok!");
        elt.updateView();

        delete elt.render;
    });

    test(".updateView() should update the shadowDom with the HTML markup returned by .render()", () => {
        testFrame.innerHTML = "<olo-vdom></olo-vdom>";
        var elt = testFrame.querySelector('olo-vdom');

        elt.render = () => `<div id="t1">Testing ...</div>`;
        elt.updateView();
        const div = elt.$("vdom").firstChild;
        expect(div.tagName).to.equal('DIV');
        expect(div.id).to.equal("t1");
        expect(div.textContent).to.equal("Testing ...");

        elt.render = () => `<div id="t2">Testing ... ...</div>`;
        elt.updateView();
        expect(elt.$("vdom").firstChild).to.equal(div);
        expect(div.id).to.equal("t2");
        expect(div.textContent).to.equal("Testing ... ...");

        elt.render = () => "<div>Testing ... ... ok!</div>";
        elt.updateView();

        delete elt.render;
    });
});
