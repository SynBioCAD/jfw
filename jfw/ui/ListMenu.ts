
import View from './View'

import { click as clickEvent } from '../event'

import { h, VNode } from '../vdom'

export class ListItem {
    title:string
}

export default class ListMenu extends View {

    items:Array<ListItem>

    constructor(project) {

        super(project)

        this.items = []

    }

    setItems(items) {

        this.items = items
        this.update()

    }

    render() {

        const elements:VNode[] = []

        this.items.forEach((item) => {

            elements.push(h('div.jfw-sidebar-entry', {

                'ev-click': clickEvent(clickItem, { view: this, item: item })

            }, item.title))

        })


        return h('div.jfw-sidebar-entry-list', elements)

    }

}

function clickItem(data) {

    const { view, item } = data

    if(item.onClick)
        item.onClick()

}


