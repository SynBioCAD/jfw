
import App from '../App'
import View from './View'
import Sidebar from './Sidebar'
import { VNode } from "../vdom";

export default abstract class Mode {

    app:App
    active:boolean
    view:View|null
    leftSidebar:Sidebar|null
    rightSidebar:Sidebar|null

    constructor(
        app:App,
        active:boolean,
        view:View|null,
        leftBar:Sidebar|null,
        rightBar:Sidebar|null
    ) {
        this.app = app
        this.active = active
        this.view = view
        this.leftSidebar = leftBar
        this.rightSidebar = rightBar
    }

    abstract getName():VNode

}

