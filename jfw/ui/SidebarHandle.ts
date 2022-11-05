
import { h, VNode } from "../vdom";
import { Sidebar } from ".";
import drag from '../event/drag'
import Rect from "../geom/Rect";

export default class SidebarResizer {

    sidebar:Sidebar

    constructor(sidebar:Sidebar) {
        this.sidebar = sidebar
    }

    render():VNode {
        return h('div.jfw-sidebar-handle', {
            'ev-mousedown': drag(ondrag, { sidebar: this.sidebar })
        })
    }
}

function ondrag(data) {

//     console.dir(data)

    let sidebar:Sidebar = data.sidebar

    let target = data.target
    
    if(target.previousElementSibling.classList.contains('jfw-sidebar')) {

        // handle is to right of sidebar

        let sidebarElem = target.previousElementSibling

        sidebar.width = data.x
        sidebar.update()

    } else if(target.nextElementSibling.classList.contains('jfw-sidebar')) {

        // handle is to left of sidebar

        let sidebarElem = target.nextElementSibling

        sidebar.width = window.innerWidth - data.x
        sidebar.update()

    }
}

