


import View from './View'

import { click as clickEvent } from '../event'

import { VNode, h } from '../vdom'
import App from "../App";
import Dialog from "./dialog/Dialog";

import keyupChangeEvent from '../event/keyup-change-handler'

export class TreeNode {
    id:string = ''
    title:string = ''
    subnodes:Array<TreeNode> = []
    expanded:boolean = false
}

export default class TreeView extends View {

    expanded: {}
    editable: boolean
    _onCreate: (parentID?:string) => void
    _onSelect: (id:string) => void
    fetchNodes: () => Array<TreeNode>
    currentNodeID: string
    searchable: boolean
    searchQuery: string

    constructor(app:App, dialog?:Dialog) {

        super(app, dialog)

        this.expanded = {}
        this._onSelect = (parentID?:string) => { console.warn('onSelect stub') }
        this._onCreate = (id:string) => { console.warn('onCreate stub') }
        this.editable = false
        this.searchable = false
        this.searchQuery = ''

    }

    setNodeFetcher(fetchNodes:() => Array<TreeNode>):void {

        this.fetchNodes = fetchNodes

        //this.selectedNode = nodeFetcher().filter((node) => node.defaultNode)[0]

        this.app.update()
    }

    setCurrentNodeID(id:string) {

        this.currentNodeID = id

    }

    onSelect(fn:(id:string) => void):void {

        this._onSelect = fn

    }

    onCreate(fn:(parentID?:string) => void):void {

        this._onCreate = fn

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

    render():VNode {

        const view = this

        if(!this.fetchNodes)
            return h('div.loader')

        let searchQuery = this.searchQuery

        const nodes:Array<TreeNode> = this.fetchNodes()

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

            if(node.subnodes.length > 0) {
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

            if(node.subnodes.length > 0 && (expanded[node.id] || searchQuery)) {

                let renderedSubnodes:VNode[] = []

                for(let subnode of node.subnodes) {

                    let subnodeRes = renderNode(subnode, depth + 1, expanded, currentNodeID, editable)

                    if(subnodeRes.anyVisible) {
                        anyVisible = true
                        renderedSubnodes.push(subnodeRes.renderedNode)
                    }
                }

                elements.push(
                    h('div', renderedSubnodes.concat(editable ? renderCreateNode(node, depth + 1) : []))
                )
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
    const app = view.app
    const node = data.node

    view.expanded[node.id] = !view.expanded[node.id]

    app.update()

}

function clickSelectNode(data) {

    const view = data.view
    const app = view.app
    const node = data.node

    console.log('tree: selected ' + JSON.stringify(node))

    view._onSelect(node.id)

    app.update()

}

function clickCreateNode(data) {

    const view = data.view
    const app = view.app
    const parentNode = data.parentNode

    view._onCreate(parentNode ? parentNode.id : null)

    app.update()

}

function onChangeSearch(data) {

    let view = data.view
    let q = data.value

    view.setSearchQuery(q)


}




