

import { h, VNode } from '../../vdom'

import changeEvent from '../../event/change-handler'

import extend = require('xtend')

export default class Slider {

    value:number
    updateCtx:any
    attr:any
    _onChange:() => void

    constructor(updateCtx, initialValue) {

        this.value = initialValue
        this.updateCtx = updateCtx
        this._onChange = () => {}

        this.attr = {}

    }

    render():VNode {

        return h('input', extend({
            type: 'range',
            value: this.value,
            'ev-change': changeEvent(onChange, { field: this })
        }, this.attr))
    }

    onChange(fn:() => void):void {

        this._onChange = fn

    }

    getValue():number {

        return this.value

    }

    setValue(value:number):void {

        this.value = value
        this.updateCtx.update()

    }

    setMin(min:number):void {
        this.attr.min = min
    }

    setMax(max:number):void {
        this.attr.max = max
    }

    setStep(step:number):void {
        this.attr.step = step
    }

}

function onChange(data) {

    const { field, value } = data

    field.value = value
    field._onChange(value)
    field.updateCtx.update()

}


