
import extend = require('xtend')
import { h } from '../vdom'

import { Vec2, Rect, Matrix } from '../geom'
import { svgDomMatrices } from '../util'

import documentOffset from 'document-offset'

import BaseEvent = require('value-event/base-event')
import Delegator = require('dom-delegator')

export default BaseEvent(handleDrag)

function handleDrag(ev, broadcast) {

    var data = this.data;
    var delegator = Delegator();
    
    /* left mouse button only
     */
    if(ev.button !== 0)
        return;

    var element = ev.target;

    var svgElement = element;

    while(svgElement && svgElement.tagName.toUpperCase() != 'SVG') {

        svgElement = svgElement.parentNode;

        if(!svgElement.tagName) {
            svgElement = null;
            break;
        }
    }

    if(svgElement) {

        handleSvgDrag(data, delegator, svgElement, ev, broadcast)
        return
    }

    var offset = {
        x: ev.clientX - element.getBoundingClientRect().left,
        y: ev.clientY - element.getBoundingClientRect().top
    };

    var current = {
        x: element.getBoundingClientRect().left - element.parentNode.getBoundingClientRect().left,
        y: element.getBoundingClientRect().top - element.parentNode.getBoundingClientRect().top,
    };

    //console.log('starting at')
    //console.log(current)
    
    //console.log('offset is')
    //console.log(offset)

    var started = false;

    function onmove(ev) {
        var previous = current;

        current = {
            x: ev.clientX - element.parentNode.getBoundingClientRect().left - offset.x,
            y: ev.clientY - element.parentNode.getBoundingClientRect().top - offset.y,
        };

        //console.log('moved to')
        //console.log(current)

        var d = {
            ev: ev,
            rawX: ev.clientX,
            rawY: ev.clientY,
            mouseX: current.x,
            mouseY: current.y,
            x: current.x,
            y: current.y,
            target: element,
            dragState: 'start'
        };

        if (!started) {
            broadcast(extend(data, d));
            started = true
        }

        d.dragState = 'move'

        broadcast(extend(data, d));
    }

    function onup(ev) {
        delegator.unlistenTo('mousemove');
        delegator.removeGlobalEventListener('mousemove', onmove);
        delegator.removeGlobalEventListener('mouseup', onup);

        broadcast(extend(data, {
            ev: ev,
            dragState: 'end',
            rawX: ev.screenX,
            rawY: ev.screenY,
            mouseX: current.x,
            mouseY: current.y,
            x: current.x,
            y: current.y,
            target: element
        }));
    }

    delegator.listenTo('mousemove');
    delegator.addGlobalEventListener('mousemove', onmove);
    delegator.addGlobalEventListener('mouseup', onup);

}



function handleSvgDrag(data, delegator, svgElement, ev, broadcast) {

    var element = ev.target;

    var svgRect = svgElement.getBoundingClientRect();

    const transform = svgDomMatrices.getSvgElementTransform(element)

    const scale = transform.getScaleVector()
    const scaleMatrix = Matrix.identity().scale(scale)
    const invTransform = scaleMatrix.invert()


    //console.log(transform)
    //console.log(invTransform)

    var current = Vec2.fromXY(ev.clientX - svgRect.left, ev.clientY - svgRect.top)

    var offset;

    if(svgElement) {

        offset = invTransform.transformVec2(current)

    } else {

        var elementOffset = documentOffset(element);

        offset = Vec2.fromXY(current.x - elementOffset.left,
                      current.y - elementOffset.top);

    }

    var started = false;

    function onmove(ev) {
        var previous = current;

        current = Vec2.fromXY(
            ev.clientX - svgRect.left,
            ev.clientY - svgRect.top
        )

        const coord = invTransform.transformVec2(current)

        var d = {
            rawX: ev.clientX,
            rawY: ev.clientY,
            mouseX: current.x,
            mouseY: current.y,
            x: coord.x,
            y: coord.y,
            target: element,
            dragState: 'start'
        };

        if(!started) {
            broadcast(extend(data, d));
            started = true
        }

        d.dragState = 'move'

        broadcast(extend(data, d));
    }

    function onup(ev) {
        delegator.unlistenTo('mousemove');
        delegator.removeGlobalEventListener('mousemove', onmove);
        delegator.removeGlobalEventListener('mouseup', onup);

        const coord = invTransform.transformVec2(current)

        broadcast(extend(data, {
            dragState: 'end',
            rawX: ev.clientX,
            rawY: ev.clientY,
            mouseX: current.x,
            mouseY: current.y,
            x: coord.x,
            y: coord.y,
            target: element
        }));
    }

    delegator.listenTo('mousemove');
    delegator.addGlobalEventListener('mousemove', onmove);
    delegator.addGlobalEventListener('mouseup', onup);
}



