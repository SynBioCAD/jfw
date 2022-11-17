import { h } from "../vdom"
import App from "./App"
import View from "./View"

import { click as clickEvent } from '../event'
import Hook from "../util/Hook"

export interface DataTableColumn<T> {
	id:string
	title:string
	getValue:(item:T)=>string
}

type DataTableGetter<T> = (offset:number, limit:number, sortBy:DataTableColumn<T>|undefined, sortOrder:'asc'|'desc', filter:string)=>Promise<{ total:number, rows: T[] }>
export default class DataTable<T> extends View {

	columns:DataTableColumn<T>[]

	sortBy:DataTableColumn<T>|undefined
	sortOrder:'asc'|'desc'

	rows:T[]|null
	total:number

	offset:number
	limit:number
	filter:string

	onClickRow:Hook<T> = new Hook()


	getter:DataTableGetter<T>
    
	constructor(updateable, columns:DataTableColumn<T>[], getter:DataTableGetter<T>) {

		super(updateable)

		this.columns = columns
		this.offset = 0
		this.limit = 10
		this.rows = null
		this.total = 0
		this.filter = ''
		this.getter = getter

		this.fetchRows()
	}

	async fetchRows() {

		this.rows = null
		this.update()

		let { rows, total } = await this.getter(this.offset, this.limit, this.sortBy, this.sortOrder, this.filter)

		this.rows = rows
		this.total = total

		this.update()
	}

	render() {

		let columns = this.columns
		let rows = this.rows

		return h('div', [
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
			]),
			h('div.jfw-datatable-controls', [
				'Showing ' + (this.offset + 1) + ' to ' + (this.offset + 1 + this.limit) + ' of ' + this.total + ' entries'
			])
		])

	}

	clickColumn(c:DataTableColumn<T>) {

		if(this.sortBy === c) {
			this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
		} else {
			this.sortBy = c
			this.sortOrder = 'asc'
		}

		this.fetchRows()
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