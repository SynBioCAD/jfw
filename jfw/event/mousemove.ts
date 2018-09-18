
'use strict';

import extend = require('xtend')

import BaseEvent = require('value-event/base-event')

function handleMousemove(ev, broadcast) {

    broadcast(extend(this.data, {
        x: ev.clientX,
        y: ev.clientY,
        offsetX: ev.offsetX,
        offsetY: ev.offsetY,
        target: ev.target
    }))

}

export default BaseEvent(handleMousemove)




