
import CodeMirror = require('codemirror')

import './dnaseq-mode'

const charsPerRow = 40

import leftPad = require('left-pad')

function configurateEditor(cm) {

    cm.setOption('firstLineNumber', 0)

    cm.setOption('lineWrapping', true)

    //cm.setSize(charsPerRow * 16, null)

    cm.setOption('lineNumberFormatter', function(line) {

        return leftPad(line * charsPerRow, 4, 0)


    })

    var editing = false

    cm.on('beforeChange', (cm, changeObj) => {

        if(editing) {
            changeObj.update(changeObj.from, changeObj.to, changeObj.text)
            return
        }

        var newText = changeObj.text.map((str) => {

            var newStr = ''

            for(var i = 0; i < str.length; ++ i) {

                var ch = str[i]

                ch = ch.toLowerCase()

                if([ 'a', 't', 'c', 'g' ].indexOf(ch) !== -1) {

                    newStr += ch


                }


            }

            return newStr

        })

        newText = newText.filter((str) => str.trim().length > 0)

        if(newText.length > 0) {

            changeObj.update(changeObj.from, changeObj.to, newText)
            reallyHardWrap(cm)

        } else {
            changeObj.cancel()
        }

    })

    function reallyHardWrap(cm) {

        if(editing)
            return

        editing = true

        cm.eachLine((line) => {

            const text = line.text

            if(text.length > charsPerRow) {

                const lineNum = cm.getLineNumber(line)

                if(cm.getLine(lineNum + 1)) {
                    cm.replaceRange('',
                        { line: lineNum, ch: charsPerRow },
                        { line: lineNum, ch: text.length }
                    )
                } else {
                    cm.replaceRange('\n',
                        { line: lineNum, ch: charsPerRow },
                        { line: lineNum, ch: text.length }
                    )
                }

                cm.replaceRange(text.slice(charsPerRow),
                    { line: lineNum + 1, ch: 0 }
                )

            }


        })

        editing = false

    }


}

export default configurateEditor



