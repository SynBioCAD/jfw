
'use strict';

import extend = require('xtend')

import Vec2 from '../geom/Vec2'

import BaseEvent = require('value-event/base-event')

function handleGesture(ev, broadcast) {

    ev.preventDefault()


//console.log(ev)

    broadcast(extend(this.data, {
        target: ev.target
    }))
}

export default BaseEvent(handleGesture)





