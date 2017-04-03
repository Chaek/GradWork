import * as fetch from 'isomorphic-fetch';
import * as I from '../interfaces/interfaces'
import * as K from '../constants/constants'
import * as WS from '../helpers/websocket'
import {store} from '../reducers/reducers'
import * as FETCH from '../helpers/fetchhelper'

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

export function SCAN_IMAGE(deviceName:string) {
    let mes:I.ResponseModel<string> = {
        type: "Something",
        mes: "Something",
        data: deviceName
    }
    let json = JSON.stringify(mes)
    let address = WS.LOCAL_APP_ADDRESS + WS.SCANNER_CONTROLLER + WS.METHOD_SCAN
    return function(dispatch:any) {
        //can display that printing is going to be started
        //now it doesn't matter
        dispatch({ type: K.SCANNING_WAIT })
        return WS.SingletonWS.getInstance()
        .send(json, address)
        //check response model and display whether it's an error or it's OK
        //not it's doesn't matter
        .then(v=>store.dispatch({type:K.SCANNING_RECIEVE_OK, image:(v as any).data}))
        .catch(e=>store.dispatch({type:K.SCANNING_RECIEVE_ERROR}))
    }
}

export function PRINT_IMAGE(value:I.DataToPrint) {
    let mes:I.ResponseModel<I.DataToPrint> = {
        type: "Something",
        mes: "Something",
        data: value
    }
    let json = JSON.stringify(mes)
    let address = WS.LOCAL_APP_ADDRESS + WS.PRINTER_CONTROLLER + WS.METHOD_PRINT
    return function(dispatch:any) {
        //can display that printing is going to be started
        //now it doesn't matter
        //dispatch({ type: K.PRINTING_CHANGE_STATUS, status:K.PRINTING_PREPARE, name})
        return WS.SingletonWS.getInstance()
        .send(json, address)
        //check response model and display whether it's an error or it's OK
        //not it's doesn't matter
        .then(v=>dispatch({ type: K.PRINTING_COMPLETE}))
        .catch(e=>dispatch({ type: K.PRINTING_COMPLETE}))
    }
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

//obsollete
export function GET_SCAN_INFO_FROM_LOCAL() {
    let mes:I.ResponseModel<any> = {
        type: "Something",
        mes: "Something",
        data: null
    }
    let mesJSON = JSON.stringify(mes)
    let address = WS.LOCAL_APP_ADDRESS + WS.SCANNER_CONTROLLER + WS.METHOD_INFO
    return function(dispatch:any) {
        dispatch({ type: K.SCANNING_PREPARE_TO_SCAN })
        return WS.SingletonWS.getInstance()
        .send(mesJSON, address)
        .then(v=>store.dispatch({ imageType:K.SCANNER, type: K.RECIEVE, records: (v as any).data }))
        .catch(e=>console.log(e))
    }
}

export function GET_PRINTERS_INFO_FROM_LOCAL(name:any) {
    let mes:I.ResponseModel<any> = {
        type: "Something",
        mes: "Something",
        data: null
    }
    let mesJSON = JSON.stringify(mes)
    let address = WS.LOCAL_APP_ADDRESS + WS.PRINTER_CONTROLLER + WS.METHOD_INFO
    return function(dispatch:any) {
        dispatch({ type: K.PRINTING_PREPARE_TO_PRINT, name })
        return WS.SingletonWS.getInstance()
        .send(mesJSON, address)
        .then(v=>store.dispatch({ imageType:K.PRINTER, type: K.RECIEVE, records: (v as any).data }))
        .catch(e=>console.log(e))
    }
}

export function GET_IMAGE_RECORDS_LOCAL() {
    let mes:I.ResponseModel<any> = {
        type: "Something",
        mes: "Something",
        data: null
    }
    let mesJSON = JSON.stringify(mes)
    let address = WS.LOCAL_APP_ADDRESS + WS.IMAGE_CONTROLLER + WS.METHOD_GET_ALL
    return function(dispatch:any) {
        dispatch({ type: K.REQUEST,  imageType:K.LOCAL_IMAGE})
        return WS.SingletonWS.getInstance()
        .send(mesJSON, address)
        .then(v=>store.dispatch({ imageType:K.LOCAL_IMAGE, type: K.RECIEVE, records: (v as any).data }))
        .catch(e=>console.log(e))
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
    let address = WS.LOCAL_APP_ADDRESS + WS.IMAGE_CONTROLLER + WS.METHOD_EDIT
    return function(dispatch:any) {
        //dispatch({comType, type: K.PREPARE_COMMAND})
        return WS.SingletonWS.getInstance()
        .send(json, address)
        .then(v=>store.dispatch({ imageType:K.LOCAL_IMAGE, type: K.ADD, record: (v as any).data }))
        .catch(v=>{console.log((v as any).data)})
    }
}