
'use strict';

import extend = require('xtend')

import Vec2 from '../geom/Vec2'

import BaseEvent = require('value-event/base-event')

function handleFileDrop(ev, broadcast) {

    ev.preventDefault()

    console.log(ev)


    // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop


    var files:File[] = []

    if(ev._rawEvent.dataTransfer) {
        var dt = ev._rawEvent.dataTransfer
        if (dt.items) {
            // CHROME
            // Use DataTransferItemList interface to access the file(s)
            for (var i=0; i < dt.items.length; i++) {
                if (dt.items[i].kind == "file") {
                    var f = dt.items[i].getAsFile();
                    files.push(f)
                }
            }
        } else {
            // Use DataTransfer interface to access the file(s)
            for (var i=0; i < dt.files.length; i++) {
                files.push(dt.files[i])
            }  
        }
    }

    broadcast(extend(this.data, {
        target: ev.target,
        files: files
    }))
}

export default BaseEvent(handleFileDrop)





