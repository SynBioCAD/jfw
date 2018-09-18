import Mode from './Mode';
import { App } from '..';

import extend = require('xtend')
import { h, VNode } from '../vdom'

import { documentMetrics } from '../util'

import { click as clickEvent } from '../event'

export default abstract class Topbar {

    app:App

    constructor(app:App) {

        this.app = app

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

        const app:App = this.app

        const modes:Array<Mode> = app.modes

        const elements:Array<VNode> = []

        modes.forEach((mode:Mode) => {

            elements.push(
                h('span.jfw-spacer', ' '),
                h('button.jfw-topbar-tab' + (mode.active ? '.active' : ''), {

                    'ev-click': clickEvent(clickTab, { app: app, mode: mode }),

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

    const { app, mode } = data

    app.setMode(mode)

}

