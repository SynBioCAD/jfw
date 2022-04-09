
import { h } from '../../vdom'
import Dialog from './Dialog'
import View from '../View'
import { click as clickEvent } from '../../event'


export class Tab {
    title:string
    view:View
    defaultTab:boolean

    constructor(title:string, view:View, isDefault:boolean) {
        this.title = title
        this.view = view
        this.defaultTab = isDefault

    }
}

export default class TabbedDialog extends Dialog {

    tabs:Array<Tab>
    currentTab:Tab|null

    constructor(app, opts) {

        super(app, opts)

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
            h('div.jfw-export-parts-tabs.jfw-no-select', this.tabs.map((tab) => {

                return h('div.jfw-input.jfw-no-select.jfw-button.jfw-export-parts-tab'
                            + (this.currentTab === tab ? '.active' : ''), {

                    'ev-click': clickEvent(clickTabButton, { dialog: this, tab: tab })

                }, tab.title)
                                                        
            })),

            h('div.jfw-export-parts-content',
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
