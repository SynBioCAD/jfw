
import { h } from '../../vdom'
import Dialog from './Dialog'
import View from '../View'
import { click as clickEvent } from '../../event'
import Tab from '../Tab'


export default class TabbedDialog extends Dialog {

    tabs:Array<Tab>
    currentTab:Tab|null

    constructor(updateable, host, opts) {

        super(updateable, host, opts)

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

    getContentView() {

        if(this.tabs.length === 0) {

            return h('div.loader')

        }

        if(this.currentTab === null)
            throw new Error('???')

        return h('div.jfw-tabbed-dialog-body', [
            h('div.jfw-tabbed-dialog-tabs.jfw-no-select', this.tabs.map((tab) => {

                return h('div.jfw-input.jfw-no-select.jfw-button.jfw-tabbed-dialog-tab'
                            + (this.currentTab === tab ? '.active' : ''), {

                    'ev-click': clickEvent(clickTabButton, { dialog: this, tab: tab })

                }, tab.title)
                                                        
            })),

            h('div.jfw-tabbed-dialog-content',
                this.currentTab.view.render()
            )
        ])

    }
}

function clickTabButton(data) {

    const dialog = data.dialog
    const tab = data.tab

    if(dialog.currentTab)
        dialog.currentTab.view.deactivate()

    tab.view.activate()
    dialog.currentTab = tab

    dialog.update()
}
