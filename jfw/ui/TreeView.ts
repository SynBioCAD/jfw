


import View from './View'

import { click as clickEvent } from '../event'

import { VNode, h } from '../vdom'
import App from "../App";
import Dialog from "./dialog/Dialog";

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

    constructor(app:App, dialog?:Dialog) {

        super(app, dialog)

        this.expanded = {}
        this._onSelect = (parentID?:string) => { console.warn('onSelect stub') }
        this._onCreate = (id:string) => { console.warn('onCreate stub') }
        this.editable = false

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

    render():VNode {

        const view = this

        if(!this.fetchNodes)
            return h('div.loader')

        const nodes:Array<TreeNode> = this.fetchNodes()

        //if(nodes.length === 0)
            //return h('div.loader')

        return h('div', [
            h('div.jfw-tree-view',
                nodes.map((node) => renderNode(node, 0, this.expanded, this.currentNodeID, this.editable))
                     .concat(this.editable ? renderCreateNode(null, 0) : [])
            )
        ])

        function renderNode(node:TreeNode, depth:number, expanded:{}, currentNodeID:string, editable:boolean) {

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

            if(node.subnodes.length > 0 && expanded[node.id]) {
                elements.push(
                    h('div',
                        node.subnodes.map((subnode) => renderNode(subnode, depth + 1, expanded, currentNodeID, editable))
                            .concat(editable ? renderCreateNode(node, depth + 1) : [])
                    )
                )
            }

            return h('div', elements)
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




