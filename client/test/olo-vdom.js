const model = require("model");
const OloComponent = require("olo-component");
const OloVDOM = require("olo-vdom");
const Feature = require("utils/Feature");

const h = require("virtual-dom/h");

async function updateViewAsync (elt) {
    return new Promise((resolve, reject) => {
        const onReady = function () {
            elt.removeEventListener("olo-vdom-ready", onReady);
            resolve();
        }
        elt.addEventListener("olo-vdom-ready", onReady);
        elt.updateView();
    });
}



suite("<olo-vdom>", () => {
    const testFrame = document.querySelector("#test-frame");

    test(".updateView() should update the shadowDom with the VTree returned by .render()", (done) => {
        async function run () {
            testFrame.innerHTML = "<olo-vdom></olo-vdom>";
            var elt = testFrame.querySelector('olo-vdom');

            elt.render = async function () {
                return h('div', {id:"t1"}, "Testing ...");
            }
            await updateViewAsync(elt);
            const div = elt.shadowRoot.querySelector("vdom").firstChild;
            expect(div.tagName).to.equal('DIV');
            expect(div.id).to.equal("t1");
            expect(div.textContent).to.equal("Testing ...");

            elt.render = async function () {
                return h('div', {id:"t2"}, "Testing ... ...");
            }
            await updateViewAsync(elt);
            expect(elt.shadowRoot.querySelector("vdom").firstChild).to.equal(div);
            expect(div.id).to.equal("t2");
            expect(div.textContent).to.equal("Testing ... ...");

            elt.render = async function () {
                return h('div', {}, "Testing ... ... ok!");
            }
            await updateViewAsync(elt);

            delete elt.render;
        }

        run().then(done).catch(done);
    });

    test(".updateView() should update the shadowDom with the HTML markup returned by .render()", (done) => {
        async function run () {
            testFrame.innerHTML = "<olo-vdom></olo-vdom>";
            var elt = testFrame.querySelector('olo-vdom');

            elt.render = async function () {
                return `<div id="t1">Testing ...</div>`;
            }
            await updateViewAsync(elt);
            const div = elt.shadowRoot.querySelector("vdom").firstChild;
            expect(div.tagName).to.equal('DIV');
            expect(div.id).to.equal("t1");
            expect(div.textContent).to.equal("Testing ...");

            elt.render = async function () {
                return`<div id="t2">Testing ... ...</div>`;
            }
            await updateViewAsync(elt);
            expect(elt.shadowRoot.querySelector("vdom").firstChild).to.equal(div);
            expect(div.id).to.equal("t2");
            expect(div.textContent).to.equal("Testing ... ...");

            elt.render = async function () {
                return "<div>Testing ... ... ok!</div>";
            }
            await updateViewAsync(elt);

            delete elt.render;
        }

        run().then(done).catch(done);
    });
});
