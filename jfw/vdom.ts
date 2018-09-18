

import { h, VNode } from 'virtual-dom'

import svg = require('virtual-dom/virtual-hyperscript/svg')
import Thunk = require('vdom-thunk')
import main = require('main-loop')
import diff = require('virtual-dom/vtree/diff')
import patch = require('virtual-dom/vdom/patch')
import create = require('virtual-dom/vdom/create-element')
//import partial from require('vdom-thunk')
import crappyFromHTML = require('html2hscript')


import active from './active'


function fromHTML(str:string):Promise<VNode> {

    return new Promise((resolve, reject) => {

        crappyFromHTML(str, (err, vn) => {

            if(err)
                reject(err)
            else
                resolve(vn)
        })

    })

}

export {
    VNode,
    h,
    svg,
    Thunk,
    main,
    diff,
    patch,
    create,
    active,
    fromHTML
}
