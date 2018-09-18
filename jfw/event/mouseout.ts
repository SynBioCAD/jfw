
'use strict';

import extend = require('xtend')

import BaseEvent = require('value-event/base-event')

function handleMouseout(ev, broadcast) {

    broadcast(extend(this.data, {
        x: ev.clientX,
        y: ev.clientY,
        target: ev.target
    }))

}

export default BaseEvent(handleMouseout)




