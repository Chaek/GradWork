import * as fetch from 'isomorphic-fetch';
import * as I from '../interfaces/interfaces'
import * as K from '../constants/constants'
import SingletonWS from '../helpers/websocket'
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
        return SingletonWS.getInstance().send(jsonCommand, url).then(v=>analyzeMessage(v, command.Ref))
    }
}

export function getModelsWS(mes:string, url:string) {
    return function(dispatch:any) {
        dispatch({ type: K.REQUEST_MODEL })
        return SingletonWS.getInstance().send(mes, url).then(v=>analyzeMessage(v))
    }
}

export function sendImageID(ImageID:number, Name:string) {
    let mes:I.ResponseModel<I.ImageRecord> = {
        type:"Something",
        mes:"Something",
        data: {
            ImageID,
            Name,
            IsDirty:false
        }
    }
    return SingletonWS.getInstance().send(JSON.stringify(mes), K.URL_IMAGE_SEND_ID)
}

function returnFetch(dispatch:any, address:string, 
    header:any, action_ok:any, action_er?:any) {
    return fetch(address, header)
            .then(response => response.json())
            .then(json => { return new Promise((resolve, reject) => {
                if ((json as any).mes == K.OK) {
                    dispatch(action_ok(json))
                    resolve(json)
                } else { 
                    console.log((json as any).data)
                    if (action_er !== undefined)
                        dispatch(action_er(json))
                    reject(json)
                }})
            })
}

export function getAllItemsBySubmodel(submodel:string) {
    return function(dispatch:any) { 
        dispatch({ type: K.REQUEST_MODEL })
        let address = FETCH.WEBSERVER_ADRESS + FETCH.CONTROLLER_NAME(submodel) + FETCH.METHOD_GET_ALL
        let header = FETCH.CREATE_HEADER(FETCH.GET, true)
        let action_ok = (json:any) => { return { submodel, type: K.RECEIVE_MODEL_REMOTE, model: json } }
        returnFetch(dispatch, address, header, action_ok)
    }
}

export function postItemBySubmodel(item:string, submodel:string, index:number) {
    return function(dispatch:any) { 
        dispatch({ type: K.REQUEST_MODEL })
        let address = FETCH.WEBSERVER_ADRESS + FETCH.CONTROLLER_NAME(submodel) + FETCH.METHOD_POST_ITEM
        let header = FETCH.CREATE_HEADER(FETCH.POST, true, item)
        let action_ok = (json:any) => { 
            return { ID:json.data.ID, Ref:index, submodel, type: K.CHANGE_ACTUALITY, actuality: true } }
        returnFetch(dispatch, address, header, action_ok)
        //.then(json => console.log(json))
        .then(json=>sendImageID((json as any).data.ID, (json as any).data.Name))
        
    }
}

export function removeItemBySubmodel(item:string, submodel:string, index:number) {
    return function(dispatch:any) { 
        dispatch({ type: K.REQUEST_MODEL })
        let address = FETCH.WEBSERVER_ADRESS + FETCH.CONTROLLER_NAME(submodel) + FETCH.METHOD_REMOVE_ITEM
        let header = FETCH.CREATE_HEADER(FETCH.DELETE, true, item)
        let action_ok = (json:any) => { return { Ref:index, submodel, type: K.REMOVE_ITEM } }
        returnFetch(dispatch, address, header, action_ok)
    }
}