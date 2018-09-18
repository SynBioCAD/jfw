
import AbstractUData from './UData'

var dict:any = {}

export default class TempUData extends AbstractUData {

    get(key:string):any {

        const val:any = dict[key]

        if(dict === undefined)
            return null

        return JSON.parse(val)

    }

    set(key:string, value:any):void {

        dict[key] = JSON.stringify(value)

    }

}
