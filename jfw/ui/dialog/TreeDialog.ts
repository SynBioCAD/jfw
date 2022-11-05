
import { h } from '../../vdom'

import { View } from '..'
import { Dialog } from '.'
import { click as clickEvent } from '../../event'

export class TreeNode {

    view:View
    defaultNode:boolean

    activate() {
        this.view.activate()
    }

    deactivate() {
        this.view.deactivate()
    }
}

export default class TreeDialog extends Dialog {

    nodes:Array<TreeNode>
    currentNode:TreeNode|null

    constructor(updateable, host, opts) {

        super(updateable, host, opts)

        if(new.target === TreeDialog) {
            throw new TypeError('TreeDialog base class is abstract; cannot be instantiated')
        }

        this.nodes = []
        this.currentNode = null
    }

    setNodes(nodes) {

        this.nodes = nodes

        if(this.currentNode)
            this.currentNode.deactivate()

        this.currentNode = this.nodes.filter((node) => node.defaultNode)[0]

        if(this.currentNode)
            this.currentNode.view.activate()

        this.update()

    }

    getContentView() {

        const dialog = this

        if(this.nodes.length === 0) {

            return h('div.loader')

        }

        return h('div', [
            h('div.jfw-tree-dialog-sidebar', this.nodes.map((node) => renderNode(node, 0))),
            this.currentNode ? this.currentNode.view.render() : h('div')
        ])

        function renderNode(node, depth) {

            var s = ''

            for(var i = 0; i < depth * 8; ++ i)
                s += '\u00a0';

            var icon

            if(node.subnodes.length > 0) {
                if(node.expanded)
                    icon = h('span.fa.fa-caret-down')
                else
                    icon = h('span.fa.fa-caret-right')
            } else {
                icon = h('span.fa')
            }
            
            const elements = [
                h('div.jfw-tree-dialog-line', [
                    h('span', s),
                    h('div.jfw-tree-dialog-arrow', {
                        'ev-click': clickEvent(clickToggleNode, { dialog: dialog, node: node })
                    }, [
                        icon,
                    ]),
                    h('a.jfw-tree-dialog-label', {
                        'ev-click': clickEvent(clickSelectNode, { dialog: dialog, node: node })
                    }, [
                        ' ' + node.title
                    ])
                ])
            ]

            if(node.expanded) {
                elements.push(
                    h('div', node.subnodes.map((node) => renderNode(node, depth + 1)))
                )
            }

            return h('div', elements)
        }


    }
}

function clickToggleNode(data) {

    const dialog = data.dialog
    const node = data.node

    node.expanded = !node.expanded

    dialog.update()

}

function clickSelectNode(data) {

    const dialog = data.dialog
    const node = data.node

    console.log('selected ', node.title)

    dialog.currentNode = node

    node.view.activate()

    dialog.update()

}


