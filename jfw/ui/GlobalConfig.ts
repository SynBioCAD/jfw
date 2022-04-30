
var config = {}

export default class GlobalConfig {

    static async init(_config?:any):Promise<void> {

        if(_config) {

            config = _config

            return Promise.resolve()

        } else {

            return await (await fetch('./config')).json()

        }


    }

    static get(key:string):any {

        return config[key]

    }


}
