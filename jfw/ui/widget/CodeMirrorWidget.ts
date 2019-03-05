
import { h } from '../../vdom'

import 'codemirror/mode/xml/xml'
import 'codemirror/mode/javascript/javascript'
import './dnaseq-mode'


import 'codemirror/addon/dialog/dialog'
import 'codemirror/addon/display/panel'
import 'codemirror/addon/search/searchcursor'
import 'codemirror/addon/search/search'
import 'codemirror/addon/search/jump-to-line'
import 'codemirror/addon/search/matchesonscrollbar'
import 'codemirror/addon/search/match-highlighter'
//require('codemirror/addon/selection/active-line'
import 'codemirror/addon/wrap/hardwrap'


import CodeMirror = require('codemirror')

import extend = require('xtend')

class CodeMirrorWidget {

    opts:any
    containerStyle:any
    editor:any

    constructor(opts, containerStyle) {

        this.opts = extend({

            //styleActiveLine: true,

            ranges: []

        }, opts)

        this.containerStyle = containerStyle

    }

    init() {

        console.log('init codemirror widget')

        const container = document.createElement('div')
        //container.style.backgroundColor = 'black'

        Object.keys(this.containerStyle).forEach((key) => {

            container.style[key] = this.containerStyle[key]

        })

        const spinner = document.createElement('div')
        spinner.style.width = '100%'
        spinner.style.height = '100%'
        spinner.style.color = '#777'
        spinner.style.fontSize = '120pt'
        spinner.style.textAlign = 'center'
        spinner.style.marginTop = '100px'
        spinner.classList.add('fa')
        spinner.classList.add('fa-spinner')
        container.appendChild(spinner)

        const textarea = document.createElement('textarea')

        container.appendChild(textarea)





        const editor = CodeMirror.fromTextArea(textarea, this.opts)

        if(this.opts.setup) {

            this.opts.setup(editor)

        }

        editor.setValue(this.opts.value)

        this.editor = editor

        this.updateMarksFromRanges()

        setTimeout(() => {

            this.editor.setSize(null, this.containerStyle.height)

            this.editor.refresh()

            //this.editor.on('update', () => {
                spinner.remove()
            //})

        }, 0)

        return container
    }

    updateMarksFromRanges() {

        const editor = this.editor

        editor.getAllMarks().forEach((mark) => mark.clear())

        this.opts.ranges.forEach((range) => {

            editor.markText(editor.posFromIndex(range.start), editor.posFromIndex(range.end), {
                className: range.className,
                css: 'background-color: ' + range.color,
                title: range.title
            })

        })
    }

    update(prev, elem) {

        //elem.innerHTML = 'Content set directly on real DOM node, by widget ' +
        //'<em>after</em> update.'
        console.log('update codemirror widget')

        this.editor = prev.editor

        if(this.editor.getValue() !== this.opts.value) {

            this.editor.setValue(this.opts.value)

        }

        this.updateMarksFromRanges()
    }

    afterRender() {

        console.log('codemirror widget: after render')

            this.editor.update()

    }
}

CodeMirrorWidget.prototype['type'] = 'Widget'



export default CodeMirrorWidget



