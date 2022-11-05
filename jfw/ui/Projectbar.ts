
import Mode from './Mode';
import App from './App';

import extend = require('xtend')
import { h, VNode } from '../vdom'

import { documentMetrics } from '../util'

import { click as clickEvent } from '../event'

export default abstract class Projectbar {

    app:App

    constructor(app:App) {

        this.app = app

    }

    render():VNode {

        const attr = {
        }

        return h('div.jfw-projectbar-container', {}, [

            h('div.jfw-projectbar', attr, [

		...this.app.projects.map(p => {
			return h('div.jfw-projectbar-project', p.title)
		})

	    ])
	])
	}
}

