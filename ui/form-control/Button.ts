
import { h, VNode } from '../../vdom'

import clickEvent from '../../event/click'

import extend = require('xtend')

export default class Button {

    text:string
    updateCtx:any
    attr:any
    _onClick:(() => void)

    constructor(updateCtx) {

        this.updateCtx = updateCtx

        this.attr = {}
        this.text = 'Button'

        this._onClick = () => {}

    }

    setText(text:string):void {

        this.text = text

    }

    render():VNode {

        return h('button.jfw-button.jfw-big-button', extend({
            'ev-click': clickEvent(onClick, { field: this })
        }, this.attr), this.text)
    }

    onClick(fn:() => void):void {

        this._onClick = fn

    }
}

function onClick(data:any):void {

    const field:Button = data.field

    field._onClick()

}


