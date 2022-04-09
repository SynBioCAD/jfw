
import { h, VNode } from '../vdom'
import { Vec2 } from '../geom'
import { click as clickEvent } from '../event'

export class ContextMenuItem {

    icon:string
    title:string
    action:(pos:Vec2)=>void

    constructor(icon:string, title:string, action:(pos:Vec2)=>void) {
        this.icon = icon
        this.title = title
        this.action = action
    }

}

export default class ContextMenu {

    pos:Vec2
    items:ContextMenuItem[]

    constructor(pos:Vec2, items:ContextMenuItem[]) {

        this.pos = pos
        this.items = items

    }

    render():VNode {

        return h('div.jfw-context-menu.jfw-no-select', {
            style: {
                position: 'fixed',
                left: this.pos.x + 'px',
                top: this.pos.y + 'px'
            }
        }, this.items.map(renderItem.bind(this)))

        function renderItem(item) {

            return h('div.jfw-context-menu-item', {
                'ev-click': clickEvent(clickMenuItem, { contextMenu: this, item: item })
            }, [
                h(item.icon, {
                    style: {
                        'padding-right': '10px'
                    }
                }),

                item.title
            ])
        }
    }
}

function clickMenuItem(data) {

    data.item.action(data.contextMenu.pos)

}

