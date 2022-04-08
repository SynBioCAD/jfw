
'use strict';

import { h } from '../vdom'

import extend = require('xtend')

import Vec2 from '../geom/Vec2'

import normalizeWheel, { getEventType } from '../deps/normalizeWheel/normalizeWheel'

import BaseEvent = require('value-event/base-event')

function handleMouseWheel(ev, broadcast) {

    ev.preventDefault()

    broadcast(extend(this.data, extend(normalizeWheel(ev._rawEvent), {
        target: ev.target
    })))

}

const exp = BaseEvent(handleMouseWheel)

exp.getEventName = () => {

    return getEventType()

}

export default exp








