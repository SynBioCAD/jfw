
'use strict';

import extend = require('xtend')

import BaseEvent = require('value-event/base-event')

export default BaseEvent(handleContextMenu);

function handleContextMenu(ev, broadcast) {

    ev.preventDefault();

    broadcast(extend(this.data, {
        x: ev.clientX,
        y: ev.clientY,
        offsetX: ev.offsetX,
        offsetY: ev.offsetY,
        target: ev.target
    }));

    return false;
}


