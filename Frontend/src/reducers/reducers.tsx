import * as createLogger from 'redux-logger';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import * as I from '../interfaces/interfaces'
import * as K from '../constants/constants'
import thunkMiddleware from 'redux-thunk';
import * as deepFreeze from 'deep-freeze';
import * as expect from 'expect';

const NOT_FOUND = -1

const loggerMiddleware = createLogger()

const reducer = combineReducers({
    selectedMenu,
    //commandInfo,
    //modelsBySubmodel, 
    dataManager,
    printing    
})

export const store = createStore(
    reducer,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
)


export function selectedMenu(state:string = K.MAIN_MENU, action:any) {
    switch (action.type) {
    case (K.SELECT_MENU):
        return action.menu
    default:
        return state
    }
}

export function reduceRecords(state:any[], action:any) {
    let i = NOT_FOUND
    switch (action.type) {
        case K.RECIEVE:
            return action.records
        case K.REMOVE:
            i = state.findIndex(r=>r.name == action.name)
            return (i == NOT_FOUND)? 
                state : [...state.slice(0, i), ...state.slice(i+1)]
        case K.ADD:
            i = state.findIndex(r => r.name == action.record.name)
            return (i == NOT_FOUND)?
                [...state, action.record] : 
                [...state.slice(0, i), action.record, ...state.slice(i+1)]
        default:
            return state;
    }
}

export function processSubdata(state:any = {records:[], isRequesting:false}, action:any) {
    switch (action.type) {
        case K.RECIEVE:
            return {
                isRequesting:false, 
                records: reduceRecords(state.records, action)
            }
        case K.REQUEST:
            return {
                ...state,
                isRequesting:true
            } 
        case K.REMOVE:
        case K.ADD:
            return {
                ...state,
                records: reduceRecords(state.records, action)
            }
        default:
            return state;
    }
}

export function printing(state:any = {picked: 0, status:K.PRINTING_NOTHING, name:""}, action:any) {
    switch (action.type) {
        case K.PRINTING_PICK_PRINTER:
            return {
                ...state,
                picked:action.picked
            }
        case K.PRINTING_CHANGE_STATUS:
            return {
                ...state,
                status:action.status,
                name:action.name
            }
        default:
            return state;
    }
}

export function dataManager(state:any = {}, action:any) {
    switch (action.type) {
        case K.RECIEVE:
        case K.REQUEST:
        case K.REMOVE:
        case K.ADD:
            return {
                ...state,
                [action.imageType]: processSubdata(state[action.imageType], action)
            }
        default:
            return state
    }
}