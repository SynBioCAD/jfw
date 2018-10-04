
import extend = require('xtend')
import { h, VNode } from '../../vdom'

import { click as clickEvent, drag as dragEvent } from '../../event'
import { Vec2, Rect } from '../../geom'
import { documentMetrics } from '../../util'

import uuid from 'node-uuid'

import { App } from '../..'

import Hook from '../../Hook'

export class DialogOptions {
    parent: Dialog|null
    modal: boolean
}

export default abstract class Dialog {

    app: App
    parent: Dialog|null
    children: Array<Dialog>
    modal: boolean
    title: string
    canFullScreen: boolean
    isFullScreen: boolean
    pos: Vec2
    width: number

    onClose:Hook<void>

    constructor(app:App, opts:DialogOptions) {
        
        this.app = app

        this.parent = opts.parent || null
        this.children = []
        this.modal = opts.modal || false

        if(this.parent) {
            this.parent.children.push(this)
        }

        this.setWidthAndCalcPosition(500)

        this.title = 'foo'
        this.canFullScreen = true
        this.isFullScreen = false
        this.onClose = new Hook<void>()
    }

    setTitle(title:string) {

        this.title = title
        this.app.update()

    }

    setWidthAndCalcPosition(_width:string|number) {

        const width = '' + _width

        if(width.indexOf('%') === width.length - 1) {

            const widthPc = width.substr(0, width.length - 1)

            const widthFrac = parseFloat(widthPc) / 100.0

            this.width = widthFrac * documentMetrics.width()

        } else {

            this.width = parseFloat(width)

        }

        if(this.parent) {

            this.pos = this.parent.pos.add(Vec2.fromScalar(32))

        } else {

            const yPos = documentMetrics.height() * 0.1

            this.pos = Vec2.fromXY(
                documentMetrics.width() * 0.5 -
                    this.width * 0.5,

                yPos
            )

        }
    }

    getChildDepth() {

        var d = 1

        var parent = this.parent

        while(parent) {

            ++ d

            parent = parent.parent

        }

        return d

    }

    /* overridden by subclass
     */
    getContentView() {

        return h('div', 'empty dialog')

    }

    render():VNode {

        var containerAttr = {
        }

        var attr = {
            style: {
            }
        }

        if(this.isFullScreen) {

            attr.style = {
                left: 0,
                top: 0,
                bottom: 0,
                right: 0
            }

        } else {

            attr.style = {
                left: this.pos.x + 'px',
                top: this.pos.y + 'px',
                width: this.width + 'px'
            }

        }

        const z = (99999 + this.getChildDepth())

        attr.style['z-index'] = '' + z

        if(this.isFullScreen) {
            attr.style['background-color'] = 'rgb(20, 20, 20)'
        } else {
            attr.style['background-color'] = 'rgba(0, 0, 0, 0.9)'
        }

        var buttons:VNode[] = []

        if(this.canFullScreen) {
            buttons = buttons.concat([
                h('a.fa.fa-expand', {
                    'ev-click': clickEvent(clickFullScreenButton, { dialog: this })
                }),
                h('span', '  ')
            ])
        }

        buttons.push(
            h('a.fa.fa-window-close', {
                'ev-click': clickEvent(clickCloseButton, { dialog: this })
            })
        )

        var dialogElements = [

            h('div.jfw-dialog-header.jfw-no-select', {
                'ev-mousedown': dragEvent(dragDialog, { dialog: this })
            }, [
                h('h1.jfw-dialog-close-button.jfw-normal-cursor', buttons),
                h('h1.jfw-normal-cursor', this.title)
            ]),

            h('div.jfw-dialog-content', [ this.getContentView() ])
        ]

        if(!this.isFullScreen &&
                this.children.length > 0) {

            dialogElements.push(
                h('div', {
                    style: {
                        'background-color': 'rgba(0, 0, 0, 0.8)',
                        width: this.width + 'px',
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        right: '0',
                        bottom: '0'
                    }
                })
            )

        }

        const elements:any[] = []

        if(this.modal) {

            elements.push(h('div', {
                style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    'background-color': 'rgba(0, 0, 0, 0.65)',
                    'z-index': '' + (z - 1)
                }
            }))

        }


        elements.push(
            h('div.jfw-dialog', attr, dialogElements)
        )

        return h('div', elements)

    }

    update() {

        this.app.update()

    }

}

function clickCloseButton(data) {

    const dialog = data.dialog
    const app = dialog.app

    app.closeDialog(dialog)
}

function dragDialog(data) {

    const dialog = data.dialog
    const app = dialog.app

    if(!dialog.isFullScreen) {

        dialog.pos = Vec2.fromXY(data.x, data.y)

        app.update()
    }

}

function clickFullScreenButton(data) {

    const dialog = data.dialog
    const app = dialog.app

    dialog.isFullScreen = !dialog.isFullScreen

    app.update()
}



/*
Dialog.setWidth = function setDialogWidth(state, width) {

    if(typeof width === 'string') {

        console.log(width)
        width = (parseFloat(width.split('%')[0]) / 100.0) * DocumentMetrics.width()
        console.log(width)

    }

    state.width.set(width)

    if(state.inDefaultPosition()) {

        state.position.x.set(DocumentMetrics.width() * 0.5 - width * 0.5)

    }

}

Dialog.getWidth = function getDialogWidth(state) {

    return state.fullScreen() ? DocumentMetrics.width() : state.width()

}

Dialog.addChild = function addDialogChild(state, child) {

    state.childDialogs.push(child)

    if(state.fullScreen()) {

    } else {

        Dialog.setPosition(child, Vec2.add(state.position(), Vec2(40, 40)))
    }
}


Dialog.render = function renderDialog(state, childDepth, content) {

}

function drag(state, data) {

    if(!state.fullScreen()) {
        state.inDefaultPosition.set(false)
        state.position.set(Vec2(data.x, data.y))
    }

}

function closeButton(state, data) {

    Dialog.onCloseButton.broadcast(state, { dialog: state })

}

function fullScreenButton(state, data) {

    if(!state.fullScreen()) {

        state.fullScreen.set(true)

    } else {

        state.fullScreen.set(false)

    }

}
*/

