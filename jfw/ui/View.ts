
import  App  from "./App"
import { Dialog } from "./dialog"
import { VNode } from '../vdom'
import Updateable from "./Updateable"

export default abstract class View implements Updateable {

    _update:() => void

    constructor(updateable:Updateable) {

        /* default updates the whole app
         *
         * views containd by a SubTree override update() to make
         * it update the subtree only
         */
        this._update = () => {
            updateable.update()
        }

    }

    activate():void {
    }

    deactivate():void {
    }

    abstract render():VNode|VNode[]

    update():void {

        this._update()

    }
}


