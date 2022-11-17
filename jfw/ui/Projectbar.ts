
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

        return h('div.jfw-projectbar', {}, [

            h('div.jfw-projectbar-left', {}, [

		    ...this.app.projects.map(p => {
			    return h('div.jfw-projectbar-tab' + (p.active ? '.active' : ''), {
				'ev-click': clickEvent(clickProject, { app: this.app, project: p })
			    }, [

				    h('span.jfw-projectbar-project', p.title),
				    h('span', ' '),
				    h('a.jfw-projectbar-rename', {
					    'ev-click': clickEvent(clickRenameProject, { app: this.app, project: p })
				    }, [
					h('span.fa.fa-pencil-alt')
				    ]),
				    h('span', ' '),
				    h('a.jfw-projectbar-close', {
					    'ev-click': clickEvent(clickCloseProject, { app: this.app, project: p })
				     },  [
					h('span.fa.fa-times')
				    ])

				])
		    }),
		    h('div.jfw-projectbar-tab.add', {
			'ev-click': clickEvent(clickAddProject, { app: this.app })
		    }, [
				    h('a.jfw-projectbar-add', [
			    h('span.fa.fa-plus-circle')
				    ])
		    ])


	])
	])
	}
}

function clickProject(data) {
	let { app, project } = data
	for(let p of app.projects) {
		p.active = p === project
	}
	app.update()
}

function clickRenameProject(data) {
	let { app, project } = data
}

function clickCloseProject(data) {
	let { app, project } = data
	app.closeProject(project)
}

function clickAddProject(data) {
	let { app } = data
	for(let p of app.projects) {
		p.active = false
	}
	app.addProjectView = app.createAddProjectView()
	app.update()
}


