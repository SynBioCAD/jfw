
import request = require('request')

var config = {}

export default class GlobalConfig {

    static init(_config?:any):Promise<void> {

        if(_config) {

            config = _config

            return Promise.resolve()

        } else {

            return new Promise((resolve, reject) => {

                console.log('Retreiving global config...')

                request('./config', (err, res, body) => {

                    console.log(['we got: ', err, res, typeof body, body, JSON.stringify(body)].join(', '))

                    if(err) {
                        reject(err)
                        return
                    }

                    if(res.statusCode && res.statusCode >= 300) {
                        reject(new Error('HTTP ' + res.statusCode))
                        return
                    }

                    config = JSON.parse(body)

                    resolve()
                })


            })
        }


    }

    static get(key:string):any {

        return config[key]

    }


}