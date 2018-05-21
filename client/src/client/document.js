
const parser = require("./parser");
const store = require("./store");
const engine = require("./engine");

const uuid = require("utils/uuid");



class Document {
    
    constructor (docData) {
        this.data = docData;
    }
    
    render (context={}) {
        return engine.render(this.data, context);
    }
    
    get title () {
        return this.data.title;
    }
    
    set title (newTitle) {
        this.data.title = String(newTitle);
    }
    
    get author () {
        return this.data.author;
    }
    
    getSection (index) {
        return this.data.sections[index];
    }
    
    addSection (index, sectionData={}) {
        const newSection = {
            id: sectionData.id || uuid(),
            name: sectionData.name || this._generateSectionName(),
            title: sectionData.title || "New section",
            display: {
                collapsed: Boolean(sectionData.collapsed),
                hidden: Boolean(sectionData.hidden),
                editMode: Boolean(sectionData.editMode),
            },
            template: sectionData.template || ""
        };
        this.data.sections.splice(index, 0, newSection);
        return newSection;
    }
    
    deleteSection (index) {
        const targetSection = this.getSection(index);
        this.data.sections.splice(index, 1);
        return targetSection;
    }

    moveSection (fromIndex, toIndex) {
        const targetSection = this.deleteSection(fromIndex);
        this.addSection(toIndex, targetSection);
    }
    
    _generateSectionName () {
        var index = 1;
        for (let section of this.data.sections) {
            let match = section.name.match(/section([0-9]+)/);
            if (match) {
                let n = Number(match[1]);
                index = Math.max(index, n+1);
            }
        }
        return `section${index}`;
    }    
    
    async save (href="") {
        await store.write(href, this.data);
    }
    
    static parse (domRoot) {
        const docData = parser.parseDOM(domRoot);
        return new this(docData);
    }
    
    static async load (href) {
        const docData = await store.read(href);
        return new this(docData);
    }
    
    static clearCache () {
        store.clearCache();
    }    
}



module.exports = Document;
