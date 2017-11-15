const model = require("model");
const OloViewer = require("olo-viewer");

const testFrame = document.querySelector("#test-frame");


async function setValue (elt, value) {
    return new Promise((resolve, reject) => {
        const onReady = function () {
            elt.removeEventListener("olo-vdom-ready", onReady);
            resolve();
        }
        elt.addEventListener("olo-vdom-ready", onReady);
        elt.model.value = value;
    });
}


suite("<olo-viewer>", () => {

    test("should render markdown", (done) => {
        async function run () {
            testFrame.innerHTML = `<olo-root><olo-viewer model=""></olo-viewer></olo-root>`;
            const viewer = testFrame.querySelector("olo-viewer");
            await setValue(viewer, "# Title\n**content1**");
            var html = viewer.shadowRoot.querySelector("vdom").innerHTML;
            expect(html).to.equal(`<h1 id="title">Title</h1>\n<p><strong>content1</strong></p>\n`);
        }
        run().then(done).catch(done);
    });

    test("should sanitize before rendering", (done) => {
        async function run () {
            testFrame.innerHTML = `<olo-root><olo-viewer model=""></olo-viewer></olo-root>`;
            const viewer = testFrame.querySelector("olo-viewer");
            await setValue(viewer, "# Title\n**content2**\n<script>This will be removed</script>");
            var html = viewer.shadowRoot.querySelector("vdom").innerHTML;
            expect(html).to.equal(`<h1 id="title">Title</h1>\n<p><strong>content2</strong></p>\n`);
        }
        run().then(done).catch(done);
    });
});
