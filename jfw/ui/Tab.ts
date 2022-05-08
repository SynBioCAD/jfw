import View from "./View"


export default class Tab {
	title:string
	view:View
	defaultTab:boolean
    
	constructor(title:string, view:View, isDefault:boolean) {
	    this.title = title
	    this.view = view
	    this.defaultTab = isDefault
    
	}
    }