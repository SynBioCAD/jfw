
import { View } from '.';

import extend = require('xtend')
import { h } from '../vdom'

import { click as clickEvent } from '../event'

import { documentMetrics } from '../util'
import App from "./App";

import { VNode } from '../vdom'


const indentSize:number = 10


export class SidebarDivision {

    title:string
    sections:Array<SidebarSection>

    constructor(title:string) {

        this.title = title
        this.sections = []

    }

}

export class SidebarSection {

    title:string
    view:View
    isOpen:boolean

    constructor(view:View, title:string) {

        this.title = title
        this.view = view
        this.isOpen = true

    }

}

export default abstract class Sidebar extends View {

    divisions:Array<SidebarDivision>
    currentDivision:SidebarDivision|null

    lightMode:boolean

    width:number

    constructor(updateable) {

        super(updateable)

        this.divisions = []
        this.currentDivision = null

        this.lightMode = false

        this.width = 300

    }

    setLightMode(lightMode:boolean):void {

        this.lightMode = lightMode

    }

    setDivisions(divisions:Array<SidebarDivision>):void {

        this.divisions = divisions
        this.currentDivision = divisions[0] || null

    }

    setSections(sections:Array<SidebarSection>):void {

        let dummyDivision = new SidebarDivision('dummy')
        dummyDivision.sections = sections
        this.setDivisions([ dummyDivision ])

    }

    render():VNode {

        let sidebar = this

        var children:Array<VNode> = []

        let divisions = h('div.jfw-sidebar-divisions', h('div.jfw-sidebar-divisions-inner', this.divisions.map((division) => {
            
            return h('div.jfw-sidebar-division' + (division === this.currentDivision ? '.selected' : ''), {
                'ev-click': clickEvent(clickDivision, { sidebar, division: division })
            }, division.title)

        })))

        if(this.currentDivision) {

            let onlyOneSection = this.currentDivision.sections.length === 1

            this.currentDivision.sections.forEach((section:SidebarSection) => {

                if(!onlyOneSection) {
                    if(section.title) {
                        children.push(renderHeader(0, section))
                    }
                }

                let show = section.isOpen || onlyOneSection || !section.title

                if(show) {

                    if(section.view) {
                        children.push(h('div.jfw-sidebar-section', {
                            style: {
                                width: sidebar.width + 'px'
                            }
                         }, [
                            section.view.render()
                        ]))
                    } else {
                    }

                }

            })

            let sidebarElems:VNode[] = []

            if(this.divisions.length > 1) {
                sidebarElems = sidebarElems.concat(divisions)
            }

            sidebarElems.push(h('div.jfw-sidebar-body', children))

            return h('div.jfw-sidebar', {
                style: {
                    'flex-basis': this.width + 'px'
                }
            }, sidebarElems)

            function renderHeader(indent:number, section:SidebarSection) {

                return h('div.jfw-sidebar-header', {

                    style: {
                        'margin-left': (indent * indentSize) + 'px',
                        'width': sidebar.width - indent * indentSize
                    },

                    'ev-click': clickEvent(clickHeader, { sidebar, section: section })

                }, ([

                    h(section.isOpen ? 'span.fa.fa-minus-square' : 'span.fa.fa-plus-square',
                        h('span.jfw-sidebar-header-text', section.title))

                ]))
            }
        }
    }

}

function clickDivision(data) {

    const { sidebar, division } = data

    sidebar.currentDivision = division
    sidebar.update()
}

function clickHeader(data) {

    const { sidebar, section } = data

    section.isOpen = !section.isOpen

    sidebar.update()
}

