
import { h, VNode } from '../../vdom'

import changeEvent from '../../event/change-handler'

import extend = require('xtend')

export class RadioButtonOption {
    title:string
    value:string
}

export default class RadioButtons {

    value:string
    updateCtx:any
    attr:any
    _onChange:() => void

    options:Array<RadioButtonOption> 

    constructor(updateCtx, initialValue) {

        this.value = initialValue
        this.updateCtx = updateCtx
        this.options = new Array<RadioButtonOption>()
        this._onChange = () => {}

        this.attr = {}

    }

    addOption(value:string, title:string) {

        const option = new RadioButtonOption()
        option.value = value
        option.title = title

        this.options.push(option)

    }

    render():VNode {

        return h('div',
            this.options.map((option:RadioButtonOption) => {
                return h('input', {
                    type: 'radio',
                    checked: this.value === option.value,
                    'ev-change': changeEvent(onChange, {
                        field: this,
                        value: option.value
                    })
                })
            })
        )
    }

    onChange(fn:() => void):void {

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

function onChange(data) {

    const { field, value } = data

    field.value = value
    field._onChange(value)
    field.updateCtx.update()

}


