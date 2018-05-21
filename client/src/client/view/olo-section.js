
const Vue = require("Vue");

var idCount = 0;

module.exports = {
    
    template: require('./olo-section.html!text'),
    
    props: [ 'section', 'rendering'],
    
    methods: {
                
        toggleCollapsed (event) {
            this.section.display.collapsed = !this.section.display.collapsed;
        },
        
        toggleEditMode (event) {
            this.section.display.editMode = !this.section.display.editMode;
        }
    }
}
