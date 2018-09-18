
import AbstractUData from './UData'

export default class BrowserUData extends AbstractUData {

    get(key:string):any {

        const val:any = localStorage.getItem(key)

        if(val === null)
            return null

        return JSON.parse(val)

    }

    set(key:string, value:any):void {

        localStorage.setItem(key, JSON.stringify(value))

    }

}
