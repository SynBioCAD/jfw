

import View from './View'
import { click as clickEvent } from '../event'
import { h } from '../vdom'
import Tab from './Tab'

export default class TabbedView extends View {

    tabs:Array<Tab>
    currentTab:Tab|null

    constructor(updateable) {

        super(updateable)

        this.tabs = []
        this.currentTab = null
    }

    setTabs(tabs) {

        this.tabs = tabs

        if(this.currentTab)
            this.currentTab.view.deactivate()

        this.currentTab = this.tabs.filter((tab) => tab.defaultTab)[0]

        if(this.currentTab)
            this.currentTab.view.activate()

        this.update()
    }

    render() {

        if(this.tabs.length === 0) {

            return h('div.loader')

        }

        if(this.currentTab === null)
            throw new Error('???')

        return h('div.jfw-tabbed-view', [
            h('div.jfw-tabbed-view-tabs.jfw-no-select', this.tabs.map((tab) => {

                return h('div.jfw-input.jfw-no-select.jfw-button.jfw-tabbed-view-tab'
                            + (this.currentTab === tab ? '.active' : ''), {

                    'ev-click': clickEvent(clickTabButton, { dialog: this, tab: tab })

                }, tab.title)
                                                        
            })),

            h('div.jfw-tabbed-view-content',
                this.currentTab.view.render()
            )
        ])

    }
}

function clickTabButton(data) {

    const dialog = data.dialog
    const app = dialog.app
    const tab = data.tab

    if(dialog.currentTab)
        dialog.currentTab.view.deactivate()

    tab.view.activate()
    dialog.currentTab = tab

    dialog.update()
}
