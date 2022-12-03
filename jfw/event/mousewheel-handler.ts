
'use strict';

import { h } from '../vdom'

import extend = require('xtend')

import Vec2 from '../geom/Vec2'

import normalizeWheel from 'normalize-wheel-es'

import BaseEvent = require('value-event/base-event')

function handleMouseWheel(ev, broadcast) {

    ev.preventDefault()

    broadcast(extend(this.data, extend(normalizeWheel(ev._rawEvent), {
        target: ev.target
    })))

}

const exp = BaseEvent(handleMouseWheel)

exp.getEventName = () => {

    return (normalizeWheel as any).getEventType()

}

export default exp








