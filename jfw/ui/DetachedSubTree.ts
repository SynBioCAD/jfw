
import { h, main, diff, patch, create } from '../vdom'
import { View } from ".";
//import partial from require('vdom-thunk')


export default class DetachedSubTree {

    view:View
    _stateToken:any
    _mainLoop:any

    constructor(view:View) {

        this.view = view


    }

    init():void {

        this._stateToken = { ref: this }

        const render = (stateToken:any) => {
            return stateToken.ref.view.render()
        }

        this._mainLoop = main(this._stateToken, render, {
            diff: diff,
            create: create,
            patch: patch
        })

        this.overrideViewUpdate()

        return this._mainLoop.target
    }

    update(prev:DetachedSubTree, elem:HTMLElement):void {

        //elem.innerHTML = 'Content set directly on real DOM node, by widget ' +
        //'<em>after</em> update.'

        if(this.view !== prev.view)
            return this.init()

        this._mainLoop = prev._mainLoop

        this.overrideViewUpdate()


    }

    overrideViewUpdate():void {

        const mainLoop:any = this._mainLoop

        this.view._update = () => {
            this._stateToken = { ref: this }
            //console.log('updating body main loop')
            mainLoop.update(this._stateToken)
        }


    }
}

DetachedSubTree.prototype['type'] = 'Widget'


