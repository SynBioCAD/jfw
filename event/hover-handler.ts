
'use strict';

import BaseEvent = require('value-event/base-event')

import extend = require('xtend')

function handleHover(ev, broadcast) {

    broadcast(extend(this.data, {
        x: ev.clientX,
        y: ev.clientY,
        target: ev.target
    }))

}

export default BaseEvent(handleHover)




