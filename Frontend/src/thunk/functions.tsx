import * as fetch from 'isomorphic-fetch';
import * as I from '../interfaces/interfaces'
import * as K from '../constants/constants'
import * as WS from '../helpers/websocket'
import {store} from '../reducers/reducers'
import * as FETCH from '../helpers/fetchhelper'

function analyzeMessage(mes:any, Ref?:number) {
    let data:any = JSON.parse(mes)
    let submodel:string = ""
    switch (data.type) {
        case K.PRINTER_SUBMODEL:
        case K.IMAGE_SUBMODEL:
            switch(data.mes) {
                case K.COMMAND_STATUS_WAITING:
                    break
                case K.COMMAND_STATUS_OK:
                    store.dispatch({Ref, submodel:data.type, type: K.UPDATE_ITEM, item:data.data})
                    break
                default:
                    store.dispatch({submodel:data.type, type: K.RECEIVE_MODEL_LOCAL, model: data })
            }
            break;
        default:
            break;
    }
}

//Thunk function
export function sendCommandWS(command:any, url:string, comType:string) {
    let jsonCommand:string = JSON.stringify(command.item)
    return function(dispatch:any) {
        dispatch({comType, type: K.PREPARE_COMMAND})
        return WS.SingletonWS.getInstance().send(jsonCommand, url).then(v=>analyzeMessage(v, command.Ref))
    }
}

/*
function PRINT_MESSAGE_ON_LOCAL(mes:string) {
    let address = 
    return function(dispatch:any) {
        //SOME dispatch
        return WS.SingletonWS.getInstance().send(mes, )
    }
    
}*/



function returnFetch(dispatch:any, address:string, 
    header:any, action_ok:any, action_er?:any) {
    return fetch(address, header)
            .then(response => response.json())
            .then(json => { return new Promise((resolve, reject) => {
                if ((json as any).mes == K.OK) {
                    dispatch(action_ok(json))
                    resolve(json as any)
                } else { 
                    console.log((json as any).data)
                    if (action_er !== undefined)
                        dispatch(action_er(json))
                    reject(json)
                }})
            })
}

export function GET_IMAGE_RECORDS_REMOTE() {
    return function(dispatch:any) { 
        dispatch({ type: K.REQUEST, imageType:K.REMOTE_IMAGE})
        let address = FETCH.WEBSERVER_ADRESS + FETCH.IMAGE_CONTROLLER + FETCH.METHOD_GET_ALL
        let header = FETCH.CREATE_HEADER(FETCH.GET, true)
        let action_ok = (json:any) => { return { imageType:K.REMOTE_IMAGE, type: K.RECIEVE, records: json.data } }
        returnFetch(dispatch, address, header, action_ok)
    }
}

function GET_PRINTERS_INFO_FROM_LOCAL() {
    let mes:I.ResponseModel<any> = {
        type: "Something",
        mes: "Something",
        data: null
    }
    let mesJSON = JSON.stringify(mes)
    let address = WS.LOCAL_APP_ADRESS + WS.PRINTER_CONTROLLER + WS.METHOD_INFO
    return function(dispatch:any) {
        //dispatch({ type: K.REQUEST,  imageType:K.LOCAL_IMAGE})
        return WS.SingletonWS.getInstance().send(mesJSON, address)
        .then(v=>store.dispatch({ imageType:K.PRINTER, type: K.RECIEVE, records: (v as any).data }))
    }
}

export function GET_IMAGE_RECORDS_LOCAL() {
    let mes:I.ResponseModel<any> = {
        type: "Something",
        mes: "Something",
        data: null
    }
    let mesJSON = JSON.stringify(mes)
    let address = WS.LOCAL_APP_ADRESS + WS.IMAGE_CONTROLLER + WS.METHOD_GET_ALL
    return function(dispatch:any) {
        dispatch({ type: K.REQUEST,  imageType:K.LOCAL_IMAGE})
        return WS.SingletonWS.getInstance().send(mesJSON, address)
        .then(v=>store.dispatch({ imageType:K.LOCAL_IMAGE, type: K.RECIEVE, records: (v as any).data }))
    }
}

export function REMOVE_IMAGE_REMOTE(record:any) {
    let json = JSON.stringify(record)
    return function(dispatch:any) { 
        dispatch({ type: K.REQUEST, imageType:K.REMOTE_IMAGE})
        let address = FETCH.WEBSERVER_ADRESS + FETCH.IMAGE_CONTROLLER + FETCH.METHOD_REMOVE
        let header = FETCH.CREATE_HEADER(FETCH.DELETE, true, json)
        let action_ok = (json:any) => { 
            return { imageType:K.REMOTE_IMAGE, type: K.REMOVE, name:record.name } }
        returnFetch(dispatch, address, header, action_ok)
    }
}

export function POST_IMAGE_REMOTE(record:any) {
    let json = JSON.stringify(record)
    return function(dispatch:any) { 
        dispatch({ type: K.REQUEST, imageType:K.LOCAL_IMAGE})
        let address = FETCH.WEBSERVER_ADRESS + FETCH.IMAGE_CONTROLLER + FETCH.METHOD_POST
        let header = FETCH.CREATE_HEADER(FETCH.POST, true, json)
        let action_ok = (json:any) => { 
            return { imageType:K.REMOTE_IMAGE, type: K.ADD, record } }
        returnFetch(dispatch, address, header, action_ok)
    }
}

export function EDIT_ON_LOCAL(record:any) {
    let json = JSON.stringify(record)
    let address = WS.LOCAL_APP_ADRESS + WS.IMAGE_CONTROLLER + WS.METHOD_EDIT
    return function(dispatch:any) {
        //dispatch({comType, type: K.PREPARE_COMMAND})
        return WS.SingletonWS.getInstance().send(json, address)
        .then(v=>store.dispatch({ imageType:K.LOCAL_IMAGE, type: K.ADD, record: (v as any).data }))
        .catch(v=>{console.log((v as any).data)})
    }
}