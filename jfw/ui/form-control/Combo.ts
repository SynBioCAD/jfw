
import changeEvent from '../../event/change-handler'

import { h, VNode} from '../../vdom'

import extend = require('xtend')

export default class Combo {

    value:string
    options:any
    updateCtx:any
    _onChange:(selection:string) => void
    attr:any

    constructor(updateCtx, options, initialValue) {

        this.value = initialValue
        this.options = options
        this.updateCtx = updateCtx
        this._onChange = () => {}

        this.attr = {}

    }

    render():VNode {

        return h('select', extend({
            type: 'range',
            'ev-change': changeEvent(onChange, { field: this })
        }, this.attr), this.options.map((option) => {
            return h('option', {
                value: option.value
            }, option.name)
        }))

    }

    onChange(fn:(selection:string) => void):void {

        this._onChange = fn

    }

    getValue():string {

        return this.value

    }

    setValue(value:string):void {

        this.value = value
        this.updateCtx.update()

    }

}

function onChange(data:any):void {

    const field:Combo = data.field
    const id:string = data.id

    field.value = id
    field._onChange(id)
    field.updateCtx.update()

}


