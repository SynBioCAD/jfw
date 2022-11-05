import { h, VNode } from "../vdom"
import App from "./App"
import DialogHost from "./DialogHost"
import Mode from "./Mode"
import Sidebar from "./Sidebar"
import SidebarHandle from "./SidebarHandle"
import View from "./View"

export default class Project extends View {

	app:App

	title:string
	id:string

	dialogs:DialogHost

	modes:Mode[]
	mode: Mode

	topbar: View | null

	leftSidebar: Sidebar | null
	leftSidebarHandle: SidebarHandle | null

	rightSidebar: Sidebar | null
	rightSidebarHandle: SidebarHandle | null

	active:boolean

	constructor(app:App) {
		super(app)
		this.app = app
		this.modes = []
		this.active = false
		this.dialogs = new DialogHost(app)
	}
	
	setModes(modes: Array<Mode>): void {

		this.modes = modes

		const defMode: Mode | undefined = this.modes.filter((mode) => mode.active)[0]

		if (defMode !== undefined) {
			this.setMode(defMode)
		} else if (modes.length > 0) {
			this.setMode(modes[0])
		}



		this.update()
	}

    setMode(mode): void {

        this.modes.forEach((_mode) => {
            _mode.active = false
        })

        if(this.mode && this.mode.view)
            this.mode.view.deactivate()

        this.mode = mode
        mode.active = true

        this.setLeftSidebar(mode.leftSidebar)
        this.setRightSidebar(mode.rightSidebar)

        if(mode.view)
            mode.view.activate()

        this.update()

    }

    setLeftSidebar(sidebar:Sidebar): void {

        this.leftSidebar = sidebar
        this.leftSidebarHandle = new SidebarHandle(sidebar)
        this.update()

    }

    setRightSidebar(sidebar:Sidebar): void {

        this.rightSidebar = sidebar
        this.rightSidebarHandle = new SidebarHandle(sidebar)
        this.update()

    }

    setTopbar(topbar): void {

        this.topbar = topbar
        this.update()

    }

    render():VNode {

	var elements:any[] = []

        if (this.topbar) {
            elements.push(this.topbar.render())
        }

        var ltrElements: any[] = []

	if(this.leftSidebar) {
	/*ltrElements.push(h('div.jfw-sidebar.jfw-sidebar-left' + (this.leftSidebar.lightMode ? '.jfw-light' : ''), [
		this.leftSidebar.render()
	]))
	*/
	ltrElements.push(this.leftSidebar.render())

	if(this.leftSidebarHandle)
		ltrElements.push(this.leftSidebarHandle.render())
	}

	if(this.mode && this.mode.view) {
	ltrElements.push(h('div.jfw-flow-ttb.jfw-flow-grow', {
		style: {
			minWidth: 0,
			minHeight: 0
		}
		}, [
		this.mode.view.render()
	]))
	} else {
	ltrElements.push(h('div', [
		'no modes'
	]))

	}

	if(this.rightSidebar) {
	if(this.rightSidebarHandle)
		ltrElements.push(this.rightSidebarHandle.render())
		/*
	ltrElements.push(h('div.jfw-sidebar.jfw-sidebar-right' + (this.rightSidebar.lightMode ? '.jfw-light' : ''), [
		this.rightSidebar.render()
	]))*/
	ltrElements.push(this.rightSidebar.render())
	}

        return elements.concat([
            h('div.jfw-flow-grow.jfw-flow-ltr', {
		    style: {
			    minHeight: 0
		    }
	    },ltrElements)
        ])
    }

}


