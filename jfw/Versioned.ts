
export default abstract class Versioned {

    private versionToken:{}

    constructor() {
        this.versionToken = {}
    }

    private setCur(o:{}):void {

        for(var v:Versioned|undefined = this; v; v = v.getVersionedParent()) {
            v.versionToken = o
        }

        for(var v2:Versioned|undefined = this; v2; v2 = v2.getVersionedParent()) {
            v2.onVersionChanged()
        }
    }

    touch():void {
        this.setCur({})
    }

    abstract getVersionedParent():Versioned|undefined

    isSameVersionAs(rhs:Versioned):boolean {
        return this.versionToken === rhs.versionToken
    }

    abstract onVersionChanged():void


}
