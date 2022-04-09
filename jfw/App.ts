

import { VNode, h, diff, patch, create, main } from './vdom'

import Delegator = require('dom-delegator')

import Dialog from './ui/dialog/Dialog'
import View from './ui/View'
import Mode from './ui/Mode'

import { SubTree, Sidebar } from './ui'

import ContextMenu from "./ui/ContextMenu";

import { mousewheel as wheelEvent, fileDrop as fileDropEvent } from './event'
import BrowserUData from './udata/BrowserUData';
import UData from './udata/UData';
import SidebarHandle from './ui/SidebarHandle';

export default abstract class App
{
    dialogs: Array<Dialog>

    leftSidebar: Sidebar|null
    leftSidebarHandle:SidebarHandle|null

    rightSidebar: Sidebar|null
    rightSidebarHandle:SidebarHandle|null

    topbar: View|null
    views: Array<View>
    contextMenu: ContextMenu|null
    orphanViews: Array<View>

    modes: Array<Mode>
    mode: Mode

    _mainLoop: any

    _stateToken: Object

    elem:HTMLElement

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

        this.dialogs = new Array<Dialog>()

        this.leftSidebar = null
        this.leftSidebarHandle = null

        this.rightSidebar = null
        this.rightSidebarHandle = null

        this.topbar = null
        this.views = new Array<View>()
        this.orphanViews = new Array<View>()
        this.contextMenu = null
        this.modes = []

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

        //console.log('Whole app update')

        if(this._mainLoop) {

            this._stateToken = {}
            this._mainLoop.update(this._stateToken)

        }


    }

    render():VNode {

        const elements:Array<VNode> = []
        var ltrElements: any[] = []

        Array.prototype.push.apply(elements,
            this.dialogs.map((dialog) => {
                return dialog.render()
            })
        )

        if (this.topbar) {
            elements.push(this.topbar.render())
        }

        if(this.orphanViews.length > 0) {

            const topOrphanView = this.orphanViews[this.orphanViews.length - 1]

            ltrElements.push(topOrphanView.render())

        } else {

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
                ltrElements.push(h('div.jfw-flow-ttb.jfw-flow-grow', [
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

        }

        if(this.contextMenu) {
            elements.push(this.contextMenu.render())
        }

        return h('div.jfw-container.jfw-flow-ttb', {
            'ev-dragover': fileDropEvent(onDragOver, { app: this }),
            'ev-drop': fileDropEvent(onFileDrop, { app: this })
        }, elements.concat([
            h('div.jfw-flow-grow.jfw-flow-ltr', ltrElements)
        ]))
    }

    openDialog(dialog:Dialog): void {

        //this.dialogs.push(new SubTree(dialog))
        this.dialogs.push(dialog)
        this.update()

    }

    closeDialog(dialog:Dialog): void {

        const i:number = this.dialogs.indexOf(dialog)

        this.dialogs.splice(i, 1)

        dialog.onClose.fire(undefined)

        if(dialog.parent) {

            const parentI = dialog.parent.children.indexOf(dialog)

            dialog.parent.children.splice(parentI, 1)

        }

        this.update()

    }

    closeDialogAndParents(dialog:Dialog):void {

        for(;;) {

            this.closeDialog(dialog)

            if(dialog.parent === null)
                break

            dialog = dialog.parent

        }


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

    setModes(modes:Array<Mode>): void {

        this.orphanViews = []

        this.modes = modes

        const defMode:Mode|undefined = this.modes.filter((mode) => mode.active)[0]

        if(defMode !== undefined) {
            this.setMode(defMode)
        } else if(modes.length > 0) {
            this.setMode(modes[0])
        }



        this.update()

    }

    setMode(mode): void {

        this.orphanViews = []

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



