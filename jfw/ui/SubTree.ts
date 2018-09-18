
import { h } from '../vdom'

import { Thunk, VNode } from '../vdom'
import { View } from ".";

export default class SubTree {

    _stateToken:object
    view:View
    _render:()=>{}

    constructor(view) {

        this.view = view

        this._stateToken = {}

        this._render = () => {
            return this.view.render()
        }

        this.overrideViewUpdate()
    }

    overrideViewUpdate():void {

        this.view._update = () => {
            this._stateToken = {}
            this.view.app.update()
        }

    }

    render():VNode {

        // !!! THE FUNCTION HAS TO BE THE SAME !!!
        // DON'T USE A LAMBDA HERE!

        return Thunk(this._render, this._stateToken)
    }


}



