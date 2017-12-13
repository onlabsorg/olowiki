const Model = require("model");
const OloViewer = require("olo-viewer");

const testFrame = document.querySelector("#test-frame");


suite("<olo-viewer>", () => {

    test("should render markdown", () => {
        Model.root.set("/", {
            __template__: "# Title\n**content1**"
        });

        testFrame.innerHTML = `<olo-viewer model="/"></olo-viewer>`;
        const viewer = testFrame.querySelector("olo-viewer");

        var html = viewer.$("vdom").innerHTML;
        expect(html).to.equal(`<h1 id="title">Title</h1>\n<p><strong>content1</strong></p>\n`);
    });

    test("should sanitize before rendering", () => {
        Model.root.set("/", {
            __template__: "# Title\n**content2**\n<script>This will be removed</script>"
        });

        testFrame.innerHTML = `<olo-viewer model="/"></olo-viewer>`;
        const viewer = testFrame.querySelector("olo-viewer");
        var html = viewer.$("vdom").innerHTML;
        expect(html).to.equal(`<h1 id="title">Title</h1>\n<p><strong>content2</strong></p>\n`);
    });

    test("should render the model as nunjucks template", () => {
        Model.root.set("/", {
            __template__: '{% import "./childSum" as s %}{% import "./childX" as x%}{% import "./childY" as y%}{% import "./childZ" as z%}x = {{x.v}} ; y = {{y.v}} ; z = {{z.v}} ; x+y+z = {{s.v}}',
            childX: {
                __template__: '{% set v = 10 %}v = {{v}}'
            },
            childY: {
                __template__: '{% set v = 20 %}v = {{v}}'
            },
            childZ: {
                __template__: '{% set v = 30 %}v = {{v}}'
            },
            childSum: {
                __template__: '{% import "../childX" as x %}{% import "../childY" as y %}{% import "../childZ" as z %}{% set v = x.v + y.v + z.v %}v = {{v}}'
            },
        });

        testFrame.innerHTML = `<olo-viewer model="/"></olo-viewer>`;
        const viewer = testFrame.querySelector("olo-viewer");
        var html = viewer.$("vdom").innerHTML;
        expect(html).to.equal("<p>x = 10 ; y = 20 ; z = 30 ; x+y+z = 60</p>\n");
    })
});
