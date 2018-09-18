
import BaseEvent = require('value-event/base-event')
import extend = require('xtend')

export default BaseEvent(handleClick)

function handleClick(ev, broadcast) {

    if(ev.button === 0) {

        broadcast(extend(this.data, {
            x: ev.clientX,
            y: ev.clientY,
            offsetX: ev.offsetX,
            offsetY: ev.offsetY,
            target: ev.target
        }))
    }

}



