
var listeners = {}

export default class KeyboardListener {

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


    static _onKeyDown(ev:KeyboardEvent) {

        Object.keys(listeners).forEach((id: string) => {
            listeners[id](ev)
        })

    }

}


//console.log('rwkd')

window.onkeydown = (ev:KeyboardEvent) => {
    console.log('wkd')
    console.log(ev)
    KeyboardListener._onKeyDown(ev)
}            