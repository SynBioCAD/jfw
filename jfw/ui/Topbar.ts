import Mode from './Mode';
import App from './App';

import extend = require('xtend')
import { h, VNode } from '../vdom'

import { documentMetrics } from '../util'

import { click as clickEvent } from '../event'
import Project from './Project';

export default abstract class Topbar {

    project:Project

    constructor(project:Project) {

        this.project = project

    }

    render():VNode {

        const attr = {
        }

        return h('div.jfw-topbar-container', {}, [

            h('div.jfw-topbar', attr, [

                h('div.jfw-topbar-left.jfw-no-select', extend({}, attr), [
                    h('div', {
                        style: {
                            'padding-right': '16px'
                        }
                    }, [
                        this.renderLeft()
                    ])
                ]),

                h('div.jfw-topbar-right.jfw-no-select', extend({}, attr), [
                    h('div', {
                        style: {
                            'padding-right': '16px'
                        }
                    }, [
                        this.renderRight()
                    ])
                ])

            ])
        ])
    }

    renderLeft():VNode {

        const modes:Array<Mode> = this.project.modes

        const elements:Array<VNode> = []

        modes.forEach((mode:Mode) => {

            elements.push(
                h('span.jfw-spacer', ' '),
                h('button.jfw-topbar-tab' + (mode.active ? '.active' : ''), {

                    'ev-click': clickEvent(clickTab, { project: this.project, mode: mode }),

                }, mode.getName())
            )

        })

        return h('div', {
        }, elements)

    }

    renderRight():VNode {
        return h('span')
    }

}

function clickTab(data) {

    const { project, mode } = data

    project.setMode(mode)

}

