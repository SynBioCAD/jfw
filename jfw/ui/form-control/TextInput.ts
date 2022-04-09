
import keyupChangeEvent from '../../event/keyup-change-handler'
import clickEvent from '../../event/click'

import { h, VNode} from '../../vdom'

import extend  = require('xtend')

export default class TextInput {

    value:string
    options:any
    updateCtx:any
    _onChange:(selection:string) => void
    _onSubmit:(selection:string) => void
    attr:any
    autocompleteTrie:any
    autocompleteOpts:any

    constructor(updateCtx, initialValue) {

        this.value = initialValue
        this.updateCtx = updateCtx
        this._onChange = (newVal:string) => {}
        this._onSubmit = (newVal:string) => {}

        this.attr = {}

    }

    render():VNode {

        const els:Array<VNode> = []

        els.push(h('input.jfw-input.jfw-medium-input', extend({
            type: 'text',
            value: this.value,
            'ev-change': keyupChangeEvent(onChange, { field: this }),
            'ev-keyup': keyupChangeEvent(onChange, { field: this })
        }, this.attr)))

        if(this.autocompleteOpts && this.autocompleteOpts.length > 0) {

            els.push(h('div.jfw-input-autocomplete', {
                style: {
                    position: 'absolute'
                },
                'ev-click': clickEvent(clickAutocomplete, { field: this })

            }, this.autocompleteOpts.map((opt:any) => {

                return h('span', {
                    dataset: {
                        v: opt.name
                    }
                }, opt.name)

            })))

        }

        return h('span', els)

    }

    onChange(fn:(selection:string) => void):void {

        this._onChange = fn

    }

    onSubmit(fn:(selection:string) => void):void {

        this._onSubmit = fn
    }


    getValue():string {

        return this.value

    }

    setValue(value:string):void {

        this.value = value
        this.updateCtx.update()

    }

    enableAutocomplete(trie:any) {

        this.autocompleteTrie = trie

    }

}

function onChange(data:any):void {

    const field:TextInput = data.field

    const value:string = data.value

    if(field.autocompleteTrie) {

        field.autocompleteOpts = field.autocompleteTrie.get(value)

    } else {

    }

    field.value = value
    field._onChange(value)
    field.updateCtx.update()

}

function clickAutocomplete(data:any):void {

    const field:TextInput = data.field


    var v = data.target.dataset.v || ''

    if(v) {
        field.autocompleteOpts = undefined
        field.value = v 
        field._onChange(v)
        field._onSubmit(v)
        field.updateCtx.update()
    }

}


