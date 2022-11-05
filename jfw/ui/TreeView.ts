


import View from './View'

import { click as clickEvent } from '../event'

import { VNode, h } from '../vdom'
import App from "./App";

import keyupChangeEvent from '../event/keyup-change-handler'
import Hook from '../util/Hook'
import Updateable from './Updateable';

export class TreeNode {
    id:string = ''
    title:string = ''
    subnodes:TreeNode[]|undefined = undefined
    expanded:boolean = false
    fetchSubnodes:()=>Promise<TreeNode[]>
}

export default class TreeView extends View {

    expanded: {}
    editable: boolean
    onCreate: Hook</*parentID*/string>
    onSelect: Hook</*id*/string>

    fetchNodes: () => Promise<TreeNode[]>
    nodes:TreeNode[]|undefined


    currentNodeID: string
    searchable: boolean
    searchQuery: string

    constructor(updateable:Updateable) {

        super(updateable)

        this.expanded = {}
        this.onSelect = new Hook()
        this.onCreate = new Hook()
        this.editable = false
        this.searchable = false
        this.searchQuery = ''

    }

    setNodes(nodes:TreeNode[]) {
	    this.nodes = nodes
	    this.update()
    }

    setNodeFetcher(fetchNodes:() => Promise<TreeNode[]>):void {

        this.fetchNodes = fetchNodes

        //this.selectedNode = nodeFetcher().filter((node) => node.defaultNode)[0]

	this.refresh()

    }

    refresh() {

	this.fetchNodes().then((nodes) => {
		this.nodes = nodes
		this.update()
	})

	this.update()

    }

    setCurrentNodeID(id:string) {

        this.currentNodeID = id

    }

    setEditable(editable:boolean):void {

        this.editable = editable

    }

    setSearchable(searchable:boolean):void {

        this.searchable = searchable

    }

    setSearchQuery(searchQuery:string):void {
        this.searchQuery = searchQuery
        this.update()
    }

    select(id:string) {
        this.currentNodeID = id
        this.update()
    }

    async fetchChildren(node:TreeNode) {

	if(node.fetchSubnodes && !node.subnodes) {
		node.subnodes = await node.fetchSubnodes()
	}

	this.update()

    }

    render():VNode {

        const view = this

        if(!this.nodes)
            return h('div.loader')

        let searchQuery = this.searchQuery

        const nodes:Array<TreeNode> = this.nodes

        //if(nodes.length === 0)
            //return h('div.loader')

        let elems:VNode[] = []

        if(this.searchable) {
            elems.push(h('input.jfw-long-input', {
                'ev-keyup': keyupChangeEvent(onChangeSearch, { view: this }),
                value: this.searchQuery
            }))
        }

        let renderedNodes:VNode[] = []

        for(let node of nodes) {

            let { renderedNode, anyVisible } = renderNode(node, 0, this.expanded, this.currentNodeID, this.editable)

            if(anyVisible) {
                renderedNodes.push(renderedNode)
            }
        }

        elems.push(
            h('div.jfw-tree-view',
                renderedNodes.concat(this.editable ? renderCreateNode(null, 0) : [])
            )
        )

        return h('div', elems)

        function nodeVisible(node:TreeNode) {
            return !searchQuery || node.title.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1
        }

        function renderNode(node:TreeNode, depth:number, expanded:{}, currentNodeID:string, editable:boolean):{ renderedNode:VNode, anyVisible:boolean } {

            let anyVisible:boolean = false

            var s:string = ''

            for(var i = 0; i < depth * 8; ++ i)
                s += '\u00a0';

            var icon:VNode

            if( (node.subnodes !== undefined && node.subnodes.length > 0)
			||
		(node.subnodes === undefined && node.fetchSubnodes)
	    ) {
                if(expanded[node.id])
                    icon = h('span.fa.fa-caret-down')
                else
                    icon = h('span.fa.fa-caret-right')
            } else {
                icon = h('span.fa')
            }

            if(nodeVisible(node)) {
                anyVisible = true
            }

            const selected = node.id === currentNodeID

            const elements = [
                h('div.jfw-tree-view-line' + (selected ? '.jfw-tree-view-line-selected' : ''), {
                    'ev-click': clickEvent(clickSelectNode, { view: view, node: node })
                }, [
                    h('span', s),
                    h('div.jfw-tree-view-arrow', {
                        'ev-click': clickEvent(clickToggleNode, { view: view, node: node })
                    }, [
                        icon,
                    ]),
                    h('a.jfw-tree-view-label', {
                    }, [
                        ' ' + node.title
                    ])
                ].concat(editable ? [

                    h('div.jfw-tree-view-controls', [

                        h('a.jfw-tree-view-edit', [
                            h('span.fa.fa-pencil')
                        ]),
                        '\u00a0\u00a0',
                        h('a.jfw-tree-view-delete', [
                            h('span.fa.fa-times')
                        ]),
                        '\u00a0\u00a0'
                    ])

                
                ] : []))
            ]

            if((expanded[node.id] || searchQuery)) {

		if(node.subnodes === undefined) { 

			elements.push(h('div.loader'))

		} else {

			let renderedSubnodes:VNode[] = []

			if(node.subnodes) {

				for(let subnode of node.subnodes) {

				let subnodeRes = renderNode(subnode, depth + 1, expanded, currentNodeID, editable)

				if(subnodeRes.anyVisible) {
					anyVisible = true
					renderedSubnodes.push(subnodeRes.renderedNode)
				}
				}
			}

			elements.push(
			h('div', renderedSubnodes.concat(editable ? renderCreateNode(node, depth + 1) : []))
			)
		}
            }

            return { renderedNode: h('div', elements), anyVisible }
        }

        function renderCreateNode(parentNode:TreeNode|null, depth:number) {

            var s:string = ''

            for(var i = 0; i < depth * 8; ++ i)
                s += '\u00a0';

            var icon:VNode = h('span.fa.fa-plus-circle')

            return h('div', [

                h('div.jfw-tree-view-line', {
                    'ev-click': clickEvent(clickCreateNode, { view: view, parentNode: parentNode })
                }, [
                    h('span', s),
                    depth === 0 ? h('span') : h('div.jfw-tree-view-arrow', {
                    }, [
                        h('span.fa'),
                    ]),
                    h('a.jfw-tree-view-label', {
                    }, [
                        h('a.jfw-tree-view-create', [
                            h('span.fa.fa-plus-square')
                        ])
                    ])
                ])

            ])

        }
    }

}

function clickToggleNode(data) {

    const view = data.view
    const node = data.node

    view.expanded[node.id] = !view.expanded[node.id]

    if(view.expanded[node.id] && node.subnodes === undefined) {
	    view.fetchChildren(node)
    }


    view.update()

}

function clickSelectNode(data) {

    const view = data.view
    const node = data.node

    console.log('tree: selected ' + JSON.stringify(node))

    view.currentNodeID = node.id
    view.onSelect.fire(node.id)

    view.update()

}

function clickCreateNode(data) {

    const view = data.view
    const parentNode = data.parentNode

    view.onCreate.fire(parentNode ? parentNode.id : null)

    view.update()

}

function onChangeSearch(data) {

    let view = data.view
    let q = data.value

    view.setSearchQuery(q)


}




