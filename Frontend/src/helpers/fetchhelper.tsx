export const POST = 'post'
export const DELETE = 'delete'
export const GET = 'get'

const CORS_ENABLED:RequestMode = "cors"
const CORS_UNABLED:RequestMode = "no-cors"

//export const WEBSERVER_ADRESS = 'http://localhost:25541/api/'
export const WEBSERVER_ADRESS = 'http://ankarenko-bridge.azurewebsites.net/api/'

export const METHOD_GET_ALL = '/all'
export const METHOD_POST_ITEM = '/post'
export const METHOD_REMOVE_ITEM = '/remove'

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
