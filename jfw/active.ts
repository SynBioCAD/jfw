

import { VNode, diff, patch, create } from './vdom'

export default function active(afterRender:(Node)=>void,vnode:VNode):VNode {

    return new PureWrapperWidget(vnode, afterRender)
}



function PureWrapperWidget(vnode, afterRender) {
    this.currVnode = vnode
    this.afterRender = afterRender
}

var proto = PureWrapperWidget.prototype;
proto.type = 'Widget';

proto.init = function init() {
    var elem = create(this.currVnode);

    /*var container = document.createElement('div');
    container.appendChild(elem);
    return container;*/

    setTimeout(() => {
        this.afterRender(elem)
    }, 0)

    return elem
};

proto.update = function update(prev, elem) {
    var prevVnode = prev.currVnode;
    var currVnode = this.currVnode;
    
    var patches = diff(prevVnode, currVnode);
    var rootNode = elem
    var newNode = patch(rootNode, patches);
    if (newNode !== elem) {
        elem.parentNode.replaceChild(newNode, elem)
        this.afterRender(elem)
    }
};


