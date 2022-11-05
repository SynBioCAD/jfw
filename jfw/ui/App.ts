

import { VNode, h, diff, patch, create, main } from '../vdom'

import Delegator = require('dom-delegator')

import Dialog from './dialog/Dialog'
import View from './View'
import Mode from './Mode'

import { SubTree, Sidebar } from '.'

import ContextMenu from "./ContextMenu";

import { mousewheel as wheelEvent, fileDrop as fileDropEvent } from '../event'
import BrowserUData from '../udata/BrowserUData';
import UData from '../udata/UData';
import SidebarHandle from './SidebarHandle';

import Project from './Project'
import Updateable from './Updateable'
import DialogHost from './DialogHost'

export default abstract class App implements Updateable
{
    projectbar: View|null
//     views: Array<View>
    contextMenu: ContextMenu|null
    orphanViews: Array<View>

    projects:Project[]

    getCurrentProject():Project|null {
	return this.projects.filter(p => p.active)[0] || null
    }

    _mainLoop: any

    _stateToken: Object

    elem:HTMLElement

    dialogs:DialogHost

    constructor(elem:HTMLElement) {

        const delegator = Delegator({
        })

        delegator.listenTo('mousemove')
        delegator.listenTo('mouseover')
        delegator.listenTo('mouseout')
        delegator.listenTo('mouseup')

        delegator.listenTo(wheelEvent.getEventName())

        delegator.listenTo('gesturestart')
        delegator.listenTo('gesturechange')
        delegator.listenTo('gestureend')

        delegator.listenTo('contextmenu')

        delegator.listenTo('drop')
        delegator.listenTo('dragover')

        delegator.listenTo('keyup')
        delegator.listenTo('change')

        this.projectbar = null
	this.projects = []

	this.dialogs = new DialogHost(this)

        this.orphanViews = new Array<View>()
        this.contextMenu = null

        this._stateToken = {}

        this.elem = elem
    }

    init():void {

        this._mainLoop = main(this._stateToken, this.render.bind(this), {
            diff: diff,
            create: create,
            patch: patch
        })

        this.elem.appendChild(this._mainLoop.target)
    }

    update():void {

        // console.log('Whole app update')

        if(this._mainLoop) {

            this._stateToken = {}
            this._mainLoop.update(this._stateToken)

        }


    }

    render():VNode {

        const elements:Array<VNode> = []
        var ltrElements: any[] = []

	let curProject = this.getCurrentProject()

	let dialogs = [ ...this.dialogs.dialogs ]
	if(curProject) {
		dialogs = dialogs.concat(...curProject.dialogs.dialogs)
	}

        Array.prototype.push.apply(elements,
            dialogs.map((dialog) => {
                return dialog.render()
            })
        )

        if (this.projectbar) {
            elements.push(this.projectbar.render())
        }

	if(curProject) {
	    elements.push(curProject.render())
	}

        if(this.contextMenu) {
            elements.push(this.contextMenu.render())
        }

        return h('div.jfw-flow-ttb', {
            'ev-dragover': fileDropEvent(onDragOver, { app: this }),
            'ev-drop': fileDropEvent(onFileDrop, { app: this }),
	    style:{
		    flex: 1,
		    minHeight: 0
	    },
        }, elements)
    }

    openOrphanView(view:View):void {

        this.orphanViews.push(view)
        this.update()

    }

    openContextMenu(contextMenu:ContextMenu): void {

        this.contextMenu = contextMenu
        this.update()

    }

    closeContextMenu(): void {

        this.contextMenu = null
        this.update()

    }

    setProjectBar(projectbar) {

        this.projectbar = projectbar
        this.update()

    }


    addProject(project:Project) {
	console.log('Add Project to App', project.title)

	if(this.projects.filter(p => p.id === project.id).length > 0)
		return

	this.projects.unshift(project)
	this.update()
    }

    removeProject(project:Project) {

	for(let n = 0; n < this.projects.length; ++ n) {
		if(this.projects[n].id === project.id) {
			this.projects.splice(n, 1)
			break
		}
	}

	this.update()
    }

    displayError(err:Error): void {

        //setTimeout(() => { throw err }, 0)

        throw err
    }

    onFileDrop(files:File[]) {

        console.error('Base App::onFileDrop called')

    }

    get udata():UData {

        return new BrowserUData()

    }

}


function onFileDrop(data) {

    data.app.onFileDrop(data.files)

}

function onDragOver() {

}



