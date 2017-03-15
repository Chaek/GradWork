import * as fetch from 'isomorphic-fetch';
import * as I from '../interfaces/interfaces'
import * as K from '../constants/constants'
import SingletonWS from '../helpers/websocket'
import {store} from '../reducers/reducers'

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
                console.log("dsadsa")
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

export function getModels(submodel:string) {
    return function(dispatch:any) { 
        dispatch({ type: K.REQUEST_MODEL })
        return fetch(`http://ankarenko-bridge.azurewebsites.net/api/${submodel.toLowerCase()}/all`)
               .then(response => response.json())
               //why can't assign to ResponseModel<Image>?
               .then(json => dispatch({ submodel, type: K.RECEIVE_MODEL_REMOTE, model: json }))
               .catch(() => {})
    }
}


export function postModels(model:string, submodel:string, index:number) {
    return function(dispatch:any) { 
        dispatch({ type: K.REQUEST_MODEL })
        return fetch(`http://ankarenko-bridge.azurewebsites.net/api/${submodel.toLowerCase()}/post`,
            {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body:model
            })
            //why can't assign to ResponseModel<Image>?
            .then(res => {
                if (res.ok) dispatch({ Ref:index, submodel, type: K.CHANGE_ACTUALITY, actuality: true })
                else console.log("error")
            })
    }
}

//should be deleted by id but there are were some proplems
export function removeModel(model:string, submodel:string, index:number) {
    return function(dispatch:any) { 
        //dispatch({ type: K.REQUEST_MODEL })
        return fetch(`http://ankarenko-bridge.azurewebsites.net/api/${submodel.toLowerCase()}/remove`,
            {
                method: 'delete',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body:model
            })
            //why can't assign to ResponseModel<Image>?
            .then(res => { if (res.ok) dispatch({Ref:index, submodel, type: K.REMOVE_ITEM})
            })
    }
}