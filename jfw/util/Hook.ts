
export default class Hook<T> {

    listeners:((T) => void)[] = []

    public listen(callback:(T) => void):(T) => void {

        this.listeners.unshift(callback)

        Object.defineProperty(callback, 'remove', () => {

            for(var i = 0; i < this.listeners.length; ++ i) {

                if(this.listeners[i] === callback) {

                    this.listeners.splice(i, 1)
                    break

                }

            }

        })

        return callback
    }

    public fire(p:T):void {

        for(var i = 0; i < this.listeners.length; ++ i) {

            this.listeners[i](p)

        }

    }
}

