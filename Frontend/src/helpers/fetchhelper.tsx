export const POST = 'post'
export const DELETE = 'delete'
export const GET = 'get'

const CORS_ENABLED:RequestMode = "cors"
const CORS_UNABLED:RequestMode = "no-cors"

//Controllers
export const IMAGE_CONTROLLER = 'image'


//export const WEBSERVER_ADRESS = 'http://localhost:25541/api/'
export const WEBSERVER_ADRESS = 'http://ankarenko-bridge.azurewebsites.net/api/'
export const WEBSERVER_ADRESS_DEBUG = 'http://localhost:25541/api/'

export const METHOD_GET_ALL = '/all'
export const METHOD_POST = '/post'
export const METHOD_REMOVE = '/remove'
export const METHOD_GET = '/get'

export function CONTROLLER_NAME(submodel:string) {
    return submodel.toLowerCase()
}

export function CREATE_HEADER(method:string, cors:boolean, model?:string,) {
    let kernel = {
        method: method,
        mode: cors? CORS_ENABLED : CORS_UNABLED,
        headers: {
        'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    }
    return (model !== undefined)? 
        Object.assign({}, kernel, {body:model}) : kernel
}