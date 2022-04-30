
import Vec2 from "../geom/Vec2";

var listeners = {}

export default class MouseListener {
    
    private static x:number = 0
    private static y:number = 0

    static get mousePos():Vec2 {
        return Vec2.fromXY(this.x, this.y)
    }

     static listen(id, cb) {

        if(!listeners[id]) {
            listeners[id] = cb
        }
    }

    static unlisten(id) {

        if(listeners[id]) {
            delete listeners[id]
        }
    }


    static _onMouseMove(ev:MouseEvent) {

        this.x = ev.clientX
        this.y = ev.clientY

        Object.keys(listeners).forEach((id: string) => {
            listeners[id](ev)
        })

    }

}



if(typeof document !== 'undefined') {
	document.onmousemove = (ev:MouseEvent) => {
	MouseListener._onMouseMove(ev)
	}            
}
