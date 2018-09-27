
export default abstract class Versioned {

    private versionToken:{}

    constructor() {
        this.versionToken = {}
    }

    private setCur(o:{}):void {

        for(var v:Versioned|undefined = this; v; v = v.getVersionedParent()) {
            v.versionToken = o
        }

        if(!Versioned.paused) {
            for(var v2:Versioned|undefined = this; v2; v2 = v2.getVersionedParent()) {
                v2.onVersionChanged()
            }
        }
    }

    touch():void {
        this.setCur({})
    }

    // update our version, our childrens version, and our ancestors version
    // to the SAME version.  only trigger onVersionChanged in the most-ancestrous.
    //
    touchRecursive():void {

        let cur = {}

        for(let child of this.getVersionedChildren()) {
            touchR(child)
        }

        this.versionToken = cur

        for (var v2: Versioned | undefined = this; v2; v2 = v2.getVersionedParent()) {
            v2.versionToken = cur
            if (!v2.getVersionedParent()) {
                if (!Versioned.paused) {
                    v2.forceCallbacks()
                }
            }
        }

        function touchR(d) {
            d.versionToken = cur
            for(let child of d.getVersionedChildren()) {
                touchR(child)
            }
        }

    }

    forceCallbacks() {
        for (var v2: Versioned | undefined = this; v2; v2 = v2.getVersionedParent()) {
            v2.onVersionChanged()
        }
    }

    abstract getVersionedParent():Versioned|undefined
    abstract getVersionedChildren():Versioned[]

    isSameVersionAs(rhs:Versioned):boolean {
        return this.versionToken === rhs.versionToken
    }

    setSameVersionAs(rhs:Versioned):void {
        this.versionToken = rhs.versionToken
    }

    abstract onVersionChanged():void

    static paused:boolean = false

    static pauseCallbacks() {
        this.paused = true
    }
    static unpauseCallbacks() {
        this.paused = false
    }

}
