import * as createLogger from 'redux-logger';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import * as I from '../interfaces/interfaces'
import * as K from '../constants/constants'
import SingletonWS from '../helpers/websocket'
import thunkMiddleware from 'redux-thunk';



function items(state:any[], action:I.ModelA) {
    let i = state.findIndex(v=>action.Ref==v.Ref)
    ///if (i == -1)
    switch (action.type) {
        case K.UPDATE_ITEM:
            return [...state.slice(0, i), 
                    Object.assign({}, {item:action.item}, {Ref:action.Ref, isActual:false}), 
                    ...state.slice(i+1)]
        case K.REMOVE_ITEM:
            return [...state.slice(0, i), ...state.slice(i+1)]
        case K.CHANGE_ACTUALITY:
            return [...state.slice(0, i), 
                    Object.assign({}, state[i], {isActual:action.actuality}),
                    ...state.slice(i+1)]
                //Object.assign({}, state, {isActual:action.actuality}) : state 
        case K.RECEIVE_MODEL_REMOTE:
            return action.model.data.map((v, i) => Object.assign({}, {item:v, isActual:true, Ref:i}))
        case K.RECEIVE_MODEL_LOCAL:
            //return Object.assign({}, state, {isActual:false, ref:action.ref})
            return action.model.data.map((v, i) => Object.assign({}, {item:v, isActual:false, Ref:i}))
        default:
            return state
    }
}

function models(state:I.ModelS = K.START_MODEL, action:I.ModelA) {
    switch (action.type) {
        case K.PICK_MODEL:
            return Object.assign({}, state, { picked: action.picked })
        case K.UPDATE_ITEM:
        case K.REMOVE_ITEM:
        case K.CHANGE_ACTUALITY:
            return Object.assign({}, state, { items: items(state.items, action) })
        case K.RECEIVE_MODEL_REMOTE:
            return { 
                picked: 0,
                isFetching: false, 
                lastUpdated: Date.now(),
                items: items(state.items, action) 
            }
        case K.RECEIVE_MODEL_LOCAL:
            return {
                picked: 0,
                isFetching: false,
                lastUpdated: Date.now(),
                items: items(state.items, action)
            }
        case K.REQUEST_MODEL:
            return Object.assign({}, state, { isFetching: true })
        default: 
            return state
    }
}

function selectedMenu(state:string = K.MAIN_MENU, action:I.MenuA) {
    switch (action.type) {
    case (K.SELECT_MENU):
        return action.menu
    default:
        return state
    }
}

function commandInfo(state:I.CommandS = K.START_COMMANDS, action:I.CommandA) {
    switch (action.type) {
    case (K.PREPARE_COMMAND):
        return Object.assign({}, state, {type:action.comType, status:K.COMMAND_STATUS_WAITING})
    case (K.RECEIVE_COMMAND_STATUS):
        return Object.assign({}, state, {status:action.status})
    default:
        return state
    }
}

function modelsBySubmodel(state:any = 
    {
        [K.IMAGE_SUBMODEL]:K.START_MODEL, 
        [K.PRINTER_SUBMODEL]:K.START_MODEL,
    }, 
    action:I.SubmodelA) {
    switch (action.type) {
        //case K.REMOVE:
        case K.UPDATE_ITEM:
        case K.PICK_MODEL:
        case K.REMOVE_ITEM:
        case K.RECEIVE_MODEL_REMOTE:
        case K.RECEIVE_MODEL_LOCAL:
        case K.REQUEST_MODEL:
        case K.CHANGE_ACTUALITY:
            return Object.assign({}, state, 
                { [action.submodel]: models(state[action.submodel], action) })
        default: 
            return state
    }
}

const loggerMiddleware = createLogger()

const reducer = combineReducers({
    selectedMenu,
    commandInfo,
    modelsBySubmodel    
})

export const store = createStore(
    reducer,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
)