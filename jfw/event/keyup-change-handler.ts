
'use strict';

import extend = require('xtend')

import BaseEvent = require('value-event/base-event')

export default BaseEvent(handleKeyUp);

function handleKeyUp(ev, broadcast) {

    ev.preventDefault();

    broadcast(extend(this.data, {
        //[ev.target.getAttribute('name')]: ev.target.value
        value: ev.target.value
    }));

    return false;
}


