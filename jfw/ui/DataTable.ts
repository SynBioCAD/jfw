import { h } from "../vdom"
import App from "./App"
import View from "./View"

import { click as clickEvent } from '../event'
import Hook from "../util/Hook"

export interface DataTableColumn {
	title:string
	getValue:(item:any)=>string
}

export default class DataTable extends View {

	view:View

	columns:DataTableColumn[]

	sortBy:DataTableColumn|undefined
	sortOrder:'asc'|'desc'
	rows:any[]

	offset:number|undefined
	limit:number|undefined

	onClickRow:Hook<any> = new Hook()
    
	constructor(app:App, columns:DataTableColumn[]) {

		super(app)

		this.columns = columns
	}

	setRows(rows:any) {
		this.rows = rows
		this.update()
	}

	render() {

		let columns = this.columns
		let rows = this.rows

		let offset = this.offset
		let limit = this.limit

		if(offset !== undefined) {
			rows = rows.slice(offset)
		}

		if(limit !== undefined) {
			rows = rows.slice(0, limit)
		}

		let sortBy = this.sortBy

		if(sortBy !== undefined) {
			rows = rows.slice(0).sort((a, b) => {
				let va = sortBy!.getValue(a) || ''
				let vb = sortBy!.getValue(b) || ''
				if(this.sortOrder === 'asc') { 
				return va.localeCompare(vb)
				} else {
				return vb.localeCompare(va)
				}
			})
		}


		return h('div.jfw-datatable-scroller', [
			h('table.jfw-datatable', [
				h('thead', columns.map(c => {

					let sort:any = []
					if(this.sortBy === c) {
						sort = [' ', this.sortOrder === 'asc' ? '↑' : '↓']
					}




						return h('th', {
							'ev-click': clickEvent(clickHeader, { table: this, c })
						 }, [
							 c.title,
							 sort
						 ])
					})
				),
				h('tbody',
					rows ? rows.slice( /*offset, offset + limit*/ 0).map(row => {
						return h('tr', {
							'ev-click': clickEvent(clickRow, { table: this, row })
						},columns.map(c => {
							return h('td', c.getValue(row))
						}))
					}) : h('div', 'loading')
				)
			])
		])

	}

	clickColumn(c:DataTableColumn) {

		if(this.sortBy === c) {
			this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
		} else {
			this.sortBy = c
			this.sortOrder = 'asc'
		}

		this.update()
	}

    }

    function clickHeader(data) {
	    let { table, c } = data

	    table.clickColumn(c)

    }

    function clickRow(data) {
	    let { table, row } = data
	    table.onClickRow.fire(row)
    }