
const model = require("model");
const Document = model.memory.Document;

const OloComponent = require("olo-component");
const Feature = require("utils/Feature");



suite("<olo-component>", () => {
    const testFrame = document.querySelector("#test-frame");

    suite("child components", () => {

        test("should register the child components when attached", (done) => {
            testFrame.innerHTML = `
                <olo-component id="root">
                    <olo-component id="child-1"></olo-component>
                    <olo-component id="child-2">
                        <olo-component id="child-2-1"></olo-component>
                    </olo-component>
                    <olo-component id="child-3"></olo-component>
                </olo-component>
            `;

            window.setTimeout(function () {
                var root = testFrame.querySelector("#root");
                var child1 = root.querySelector("#child-1");
                var child2 = root.querySelector("#child-2");
                var child3 = root.querySelector("#child-3");

                expect(Array.from(root.childComponents)).to.deep.equal([child1, child2, child3]);

                expect(child1.parentComponent).to.equal(root);
                expect(child2.parentComponent).to.equal(root);
                expect(child3.parentComponent).to.equal(root);

                var child21 = child2.querySelector("#child-2-1");
                expect(Array.from(child2.childComponents)).to.deep.equal([child21]);
                expect(child21.parentComponent).to.equal(child2);

                done();
            }, 10);
        });

        test("should unregister the child components when removed", function (done) {
            testFrame.innerHTML = `
                <olo-component id="root">
                    <olo-component id="child-1"></olo-component>
                    <olo-component id="child-2"></olo-component>
                    <olo-component id="child-3"></olo-component>
                </olo-component>
            `;

            window.setTimeout(function () {
                var root = testFrame.querySelector("#root");
                var child1 = root.querySelector("#child-1");
                var child2 = root.querySelector("#child-2");
                var child3 = root.querySelector("#child-3");

                expect(Array.from(root.childComponents)).to.deep.equal([child1, child2, child3]);
                expect(child1.parentComponent).to.equal(root);
                expect(child2.parentComponent).to.equal(root);
                expect(child3.parentComponent).to.equal(root);

                root.removeChild(child2);
                window.setTimeout(function () {
                    expect(Array.from(root.childComponents)).to.deep.equal([child1, child3]);
                    expect(child2.parentComponent).to.be.null;

                    done();
                }, 10);
            }, 10);
        });
    });

    suite("model binding", () => {

        test("binding to absolute path", () => {
            const refDoc = new Document();
            refDoc.root.assign({
                name: "root", children: [
                    {name: "child1", children: [
                        {name: "grandchild1"}
                    ]},
                    {name: "child2", children: [
                        {name: "grandchild2"}
                    ]}
                ]
            });
            console.log(refDoc);

            testFrame.innerHTML = '<olo-root><olo-component model="/child1/grandchild1"></olo-componnt></olo-root>';
            testFrame.querySelector("olo-root").document = refDoc;

            const component = testFrame.querySelector("olo-component");
            expect(component.model).to.equal(refDoc.root.getChild(0).getChild(0));

            component.setAttribute("model", "/child2/grandchild2");
            expect(component.model).to.equal(refDoc.root.getChild(1).getChild(0));

            component.setAttribute("model", "/child2/grandchild3");
            expect(component.model).to.be.null;
        });

        test("binding to relative path", () => {
            const refDoc = new Document();
            refDoc.root.assign({
                name: "root", children: [
                    {name: "c0", children: [
                        {name: "gc0", children: [
                            {name: "ggc0"},
                            {name: "ggc1"},
                        ]},
                        {name: "gc1", children: [
                            {name: "ggc0"},
                            {name: "ggc1"},
                        ]}
                    ]},
                    {name: "c1", children: [
                        {name: "gc0", children: [
                            {name: "ggc0"},
                            {name: "ggc1"},
                        ]},
                        {name: "gc1", children: [
                            {name: "ggc0"},
                            {name: "ggc1"},
                        ]}
                    ]}
                ]
            });

            testFrame.innerHTML = `
                <olo-root>
                    <olo-component id="cmp1">
                        <olo-component id="cmp2">
                            <olo-component id="cmp3">
                            </olo-component>
                        </olo-component>
                    </olo-component>
                </olo-root>
            `;

            testFrame.querySelector("olo-root").document = refDoc;

            const cmp1 = testFrame.querySelector("#cmp1");
            const cmp2 = testFrame.querySelector("#cmp2");
            const cmp3 = testFrame.querySelector("#cmp3");

            cmp1.setAttribute("model", '/c0');
            cmp2.setAttribute("model", './gc0/ggc0');
            cmp3.setAttribute("model", '../ggc1');
            expect(cmp1.model.path).to.equal('/c0');
            expect(cmp2.model.path).to.equal('/c0/gc0/ggc0');
            expect(cmp3.model.path).to.equal('/c0/gc0/ggc1');

            cmp1.setAttribute("model", "/c1");
            expect(cmp1.model.path).to.equal('/c1');
            expect(cmp2.model.path).to.equal('/c1/gc0/ggc0');
            expect(cmp3.model.path).to.equal('/c1/gc0/ggc1');
        });
    });

    suite("model changes", () => {
        var refDoc, cmp1, cmp2, cmp1_callsCount, cmp2_callsCount;

        setup(() => {
            refDoc = new Document();
            refDoc.root.assign({
                name: "root", children: [
                    {name: "c0", children: [
                        {name: "gc0"},
                        {name: "gc1"},
                        {name: "gc2"}
                    ]},
                    {name: "c1", children: [
                        {name: "gc0"},
                        {name: "gc1"},
                        {name: "gc2"}
                    ]}
                ]
            });

            testFrame.innerHTML = `
                <olo-root>
                    <olo-component id="cmp1" model="/c0">
                        <olo-component id="cmp2" model="./gc0">
                        </olo-component>
                    </olo-component>
                </olo-root>
            `;

            testFrame.querySelector("olo-root").document = refDoc;

            cmp1 = testFrame.querySelector("#cmp1");
            cmp1.updateView = () => {cmp1_callsCount += 1};

            cmp2 = testFrame.querySelector("#cmp2");
            cmp2.updateView = () => {cmp2_callsCount += 1};
        });

        test("should call .updateView when a new model is bound", () => {
            cmp1_callsCount = cmp2_callsCount = 0;
            cmp1.setAttribute("model", "/c1");
            expect(cmp1_callsCount).to.equal(1);
            expect(cmp2_callsCount).to.equal(1);

            cmp1_callsCount = cmp2_callsCount = 0;
            cmp2.setAttribute("model", "./gc1");
            expect(cmp1_callsCount).to.equal(0);
            expect(cmp2_callsCount).to.equal(1);
        });

        test("should call .updateView on model changes", () => {
            cmp1.setAttribute("model", "/c0");
            cmp2.setAttribute("model", "./gc0");

            var c0 = refDoc.root.getChild(0);
            var gc0 = c0.getChild(0);

            cmp1_callsCount = cmp2_callsCount = 0;
            c0.template = c0.template + "-modif";
            expect(cmp1_callsCount).to.equal(1);
            expect(cmp2_callsCount).to.equal(0);

            cmp1_callsCount = cmp2_callsCount = 0;
            gc0.template = gc0.template + "-modif";
            expect(cmp1_callsCount).to.equal(1);
            expect(cmp2_callsCount).to.equal(1);

            //detaches change listener when unbinding a model
            cmp2.setAttribute("model", "./gc1");
            cmp1_callsCount = cmp2_callsCount = 0;
            gc0.template = gc0.template + "-modif";
            expect(cmp1_callsCount).to.equal(1);
            expect(cmp2_callsCount).to.equal(0);
        });
    });
});
