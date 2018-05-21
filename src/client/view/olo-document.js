
const Vue = require("Vue");

const VueMaterial = require("vue-material/dist/vue-material.min.js");
Vue.use(VueMaterial.default);

const oloSection = require('./olo-section');
const keyString = require("utils/key-string");


module.exports = (model) => { 
    return {
    
        template: require("./olo-document.html!text"),

        components: {
            'olo-section': oloSection
        },
        
        data: function () {        
            return {
                showHidden: false,
                showDrawer: false,
                showSettings: false,
                activeSectionName: "",
                docData: model.data,
                html: {},
            };
        },    
        
        watch: {
            docData: {
                handler () {
                    this.render();
                },
                deep: true
            }
        },
        
        methods: {
            
            render () {
                model.render()
                .then(html => {
                    this.html = html;
                });
            },
                    
            activate (section) {
                this.activeSectionName = section.name;
            },
            
            collapseAll () {
                for (let section of this.docData.sections) {
                    section.display.collapsed = true;
                }
            },
            
            getActiveSectionIndex () {
                for (let i=0; i<this.docData.sections.length; i++) {
                    let section = this.docData.sections[i];
                    if (section.name === this.activeSectionName) return i;
                }
            },
            
            getActiveSection () {
                const activeSectionIndex = this.getActiveSectionIndex();
                return model.getSection(activeSectionIndex);
            },
            
            selectPreviousSection () {
                const activeSectionIndex = this.getActiveSectionIndex();
                if (activeSectionIndex > 0) {
                    this.activeSectionName = this.docData.sections[activeSectionIndex - 1].name;
                    return true;
                } else {
                    return false;
                }
            },
            
            selectNextSection () {
                const activeSectionIndex = this.getActiveSectionIndex();
                if (activeSectionIndex < this.docData.sections.length - 1) {
                    this.activeSectionName = this.docData.sections[activeSectionIndex + 1].name;
                    return true;
                } else {
                    return false;
                }
            },
            
            moveSectionUp () {
                const activeSectionIndex = this.getActiveSectionIndex();
                if (activeSectionIndex > 0) {
                    model.moveSection(activeSectionIndex, activeSectionIndex - 1);
                }            
            },
            
            moveSectionDown () {
                const activeSectionIndex = this.getActiveSectionIndex();
                if (activeSectionIndex < this.docData.sections.length - 1) {
                    model.moveSection(activeSectionIndex, activeSectionIndex + 1);
                }                        
            },
            
            toggleSectionCollapsed () {
                const activeSection = this.getActiveSection();
                activeSection.display.collapsed = !activeSection.display.collapsed;
            },
            
            toggleSectionEditMode () {
                const activeSection = this.getActiveSection();
                activeSection.display.editMode = !activeSection.display.editMode;
            },

            toggleDrawer () {
                this.showDrawer = !this.showDrawer;
            },
            
            addSection () {
                const activeSectionIndex = this.getActiveSectionIndex();
                const newSection = model.addSection(activeSectionIndex + 1, {editMode:true});
                this.activeSectionName = newSection.name;
            },
            
            deleteSection () {
                const targetSectionIndex = this.getActiveSectionIndex();
                this.selectNextSection() || this.selectPreviousSection();
                model.deleteSection(targetSectionIndex);
            },
            
            reload () {
                olo.Document.clearCache();
                this.render();
            },
            
            save () {
                console.log("Saving document ...");
                model.save()
                .then(() => {
                    console.log("Document saved!");
                });
            }
        },
        
        mounted () {
            document.body.addEventListener("keydown", (event) => {
                const keyStr = keyString(event);
                switch (keyStr) {
                    case "ctrl-up": this.selectPreviousSection(); event.preventDefault(); break;
                    case "ctrl-down": this.selectNextSection(); event.preventDefault(); break;
                    case "ctrl-shift-up": this.moveSectionUp(); break;
                    case "ctrl-shift-down": this.moveSectionDown(); break;
                    case "ctrl-space": this.toggleSectionCollapsed(); break;
                    case "ctrl-enter": this.toggleSectionEditMode(); break;
                    case "ctrl-shift-enter": this.addSection(); break;
                    case "ctrl-canc": this.deleteSection(); break;
                }
            });
            this.render();
        }
    };
}
