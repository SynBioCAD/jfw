
import  App  from "./App"
import { Dialog } from "./dialog"
import { VNode } from '../vdom'

export default abstract class View {

    app:App
    dialog:Dialog|null
    _update:() => void

    constructor(app:App, dialog?:Dialog) {

        this.app = app
        this.dialog = dialog || null

        /* default updates the whole app
         *
         * views containd by a SubTree override update() to make
         * it update the subtree only
         */
        this._update = () => {
            this.app.update()
        }

    }

    activate():void {
    }

    deactivate():void {
    }

    abstract render():VNode

    update():void {

        this._update()

    }
}


