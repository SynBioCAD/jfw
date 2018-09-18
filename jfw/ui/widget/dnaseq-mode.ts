

import CodeMirror = require('codemirror')

import extend = require('xtend')

CodeMirror.defineMode('dnaseq', configurateMode as CodeMirror.ModeFactory<any>)

const charStyles = {
    'A': 'nucleotide-a',
    'T': 'nucleotide-t',
    'C': 'nucleotide-c',
    'G': 'nucleotide-g',
    'a': 'nucleotide-a',
    't': 'nucleotide-t',
    'c': 'nucleotide-c',
    'g': 'nucleotide-g',
}

function configurateMode(config, modeConfig) {

    const opts = extend({

        blockSize: 4

    }, modeConfig || {})

    return {

        startState: startState,
        token: token

    }


    function startState() {

        return {
        }

    }

    function token(stream, state) {

        const ch = stream.next()

        const col = stream.column()

        const styles:string[] = []

        if(charStyles[ch])
            styles.push(charStyles[ch])

        if(col % opts.blockSize === opts.blockSize - 1) {

            styles.push('dnaseq-spacer')

        }

        if(styles.length === 0)
            return null

        return styles.join(' ')
    }


}


