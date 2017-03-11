import * as React from "react";
import * as ReactDOM from "react-dom";
import * as fetch from 'isomorphic-fetch';
import { combineReducers } from 'redux'
import * as deepFreeze from 'deep-freeze';
import * as expect from 'expect';
import thunkMiddleware from 'redux-thunk';
import * as createLogger from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import * as I from './interfaces/interfaces'
import * as K from './constants/constants'

//Reducer
function models(state:I.ModelS = K.START_MODEL, action:I.ModelA) {
    switch (action.type) {
        case K.PICK_MODEL:
            return Object.assign({}, state, { picked: action.picked })
        case K.RECEIVE_MODEL:
            return { 
                picked: 0,
                isFetching: false, 
                isActual: true,
                lastUpdated: Date.now(),
                items: action.model.data.map(m => m)
            }
        case K.REQUEST_MODEL:
            return Object.assign({}, state, { isFetching: true })
        default: 
            return state
    }
}

interface MenuA extends I.Action {
    menu:string
}

function selectedMenu(state:string = K.MAIN_MENU, action:MenuA) {
    switch (action.type) {
    case (K.SELECT_MENU):
        return action.menu
    default:
        return state
    }
}

enum Status { NOTHING, FAIL = 0, OK, WAITING }
enum Command { NOTHING, PRINT = 0, SCAN, WAITING }

//may be a massive of commands

interface CommandS {
    type:Command,
    status:Status,
    priority?:number
}

interface CommandA extends I.Action {
    comType:Command,
    status:Status,
    priority?:number
}

const START_COMMANDS:CommandS = {
    type:Command.NOTHING,
    status:Status.NOTHING,
}

function commandInfo(state:CommandS = START_COMMANDS, action:CommandA) {
    switch (action.type) {
    case (K.PREPARE_COMMAND):
        return Object.assign({}, state, {type:action.comType, status:Status.WAITING})
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
        case K.PICK_MODEL:
        case K.RECEIVE_MODEL:
        case K.REQUEST_MODEL:
            return Object.assign({}, state, 
                { [action.submodel]: models(state[action.submodel], action) })
        default: 
            return state
    }
}

//can I create parameterzied singleton
//don't fancy this solution
class SingletonWS {
    private static instance:SingletonWS
    private static ws:WebSocket = null

    private constuctor() {}

    public static getInstance() {
        if (!SingletonWS.instance) {
            SingletonWS.instance = new SingletonWS()
        }
        return SingletonWS.instance;
    }

    private connect(url:string) {
        return new Promise((resolve, reject) => {
            SingletonWS.ws = new WebSocket(url)
            
            SingletonWS.ws.onerror = (err:ErrorEvent) => {
                reject("Error : " + err.error)
                SingletonWS.ws.close();
            }

            SingletonWS.ws.onopen = () => {
                console.log("Connected to local app")
                resolve()
            }

            SingletonWS.ws.onclose = () => {
                console.log("Connection with local app is lost")
            }

            SingletonWS.ws.onmessage = (msg:MessageEvent) => {
                this.analyzeMessage(msg)
                SingletonWS.ws.close();
            }
        }); 
    }

    private analyzeMessage(msg:MessageEvent) {
        let data:any = JSON.parse(msg.data)
        let submodel:string = ""
        switch (data.type) {
            case K.PRINTER_SUBMODEL:
            case K.IMAGE_SUBMODEL:
                store.dispatch({submodel:data.type, type: K.RECEIVE_MODEL, model: data })
                break;
            default:
                break;
        }
    }

    public send(mes:string, url:string) {
        //ineffective but simple
        this.connect(url)
        .then(()=>SingletonWS.ws.send(mes))
        .catch(err=>console.log(err))
    }
}

//Thunk function
function sendCommandWS(command:any, url:string, comType:Command) {
    let jsonCommand:string = JSON.stringify(command)
    return function(dispatch:any) {
        dispatch({comType, type: K.PREPARE_COMMAND})
        return SingletonWS.getInstance().send(jsonCommand, url)
    }
}

function getModelsWS(mes:string, url:string) {
    return function(dispatch:any) {
        dispatch({ type: K.REQUEST_MODEL })
        return SingletonWS.getInstance().send(mes, url)
    }
}

function getModels(submodel:string) {
    return function(dispatch:any) { 
        dispatch({ type: K.REQUEST_MODEL })
        return fetch(`http://ankarenko-bridge.azurewebsites.net/api/${submodel.toLowerCase()}/all`)
               .then(response => response.json())
               //why can't assign to ResponseModel<Image>?
               .then(json => dispatch({ submodel, type: K.RECEIVE_MODEL, model: json }))
               .catch(() => {})
    }
}

const ToMainMenuButton = () =>
    <button onClick = {()=>store.dispatch({type:K.SELECT_MENU, menu:K.MAIN_MENU})}>
    Back
    </button>

const MainMenu = () =>
    <div>
        <h2><p>Main menu</p></h2>
               
        <button onClick = {()=>
                store.dispatch({type:K.SELECT_MENU, menu:K.PRINTER_MENU})}>
        Printer menu
        </button>
                
        <button onClick = {()=>
                store.dispatch({type:K.SELECT_MENU, menu:K.IMAGE_MENU})}>
        Image menu
        </button>

        <button onClick = {()=>
                store.dispatch({type:K.SELECT_MENU, menu:K.SCAN_MENU})}>
        Scan menu
        </button>
    </div>

const ImageMenu = (items:I.Image[]) =>
    <div>
        <h2><p>Image Menu</p></h2>
        <ToMainMenuButton/>
            
        <button onClick = {() =>  
                store.dispatch(getModels(K.IMAGE_SUBMODEL))}>
        Update from remote app
        </button>
            
        <button onClick = {()=>
                store.dispatch(getModelsWS("Give me it", K.URL_IMAGE_UPDATE))}>
        Update from local app
        </button>
        <br/>
        {items.map(m=><img src = {m.Data}/>)}
    </div>

const mes:any = {
    mes:'hello',
    sender:'frontend'
}

const PrinterInfo = (item:I.Printer) =>
    <div>
        <h3><p>Printer Info : </p></h3>
        {Object.keys(item).map(m=><h3><p>{m.toString() + ' : ' + (item as any)[m]}</p></h3>)}
        <input ref = {node=>this.input=node}/>
        
        <button onClick = {() => {
            let mes = this.input.value
            this.input.value = ''
            store.dispatch(sendCommandWS(mes, K.URL_PRINTER_PRINT, Command.PRINT))}}>
        Print
        </button>
    </div>
        
const PrinterMenu = (items:I.Printer[]) =>
    <div>
        <h2><p>Printer Menu</p></h2>
        
        <select onChange = {e=>store.dispatch({
            type:K.PICK_MODEL,
            submodel:K.PRINTER_SUBMODEL,
            picked:e.target.selectedIndex
        })}>
            {items.map(m=><option>{m.Name}</option>)}
        </select>

        <br/>
        <ToMainMenuButton/>

        <button onClick = {()=>
            store.dispatch(getModelsWS("Is printer there", K.URL_PRINTER_INFO)) 
        }>
        Update printers from local app
        </button>
        <br/>      
    </div>

const ScanMenu = (/*items:any[]*/) =>
    <div>
        <h2><p>Scan Menu</p></h2>
        <ToMainMenuButton/>
        <button>
        Scan
        </button>
        <br/>      
    </div>

//bad because it would get updated even if it's unnessessary
//should be used provider instead
class Main extends React.Component<any, any> {
    public render() {
        let state:any = store.getState();
        let menu = state.selectedMenu
        let items:any = []
        let item = undefined
        let i = undefined

        switch (menu) {    
            case K.PRINTER_MENU:
                items = state.modelsBySubmodel[K.PRINTER_SUBMODEL].items
                i = state.modelsBySubmodel[K.PRINTER_SUBMODEL].picked
                item = (i === undefined)? K.DEF_PRINTER_INFO : items[i]
                return (
                    <div> 
                        {PrinterMenu (items)}
                        <PrinterInfo {...item}/>
                    </div>)
            case K.IMAGE_MENU:
                items = state.modelsBySubmodel[K.IMAGE_SUBMODEL].items
                return (<div>{ImageMenu(items)}</div>) 
            case K.MAIN_MENU:
                return <MainMenu/>
            case K.SCAN_MENU:
                return <ScanMenu/>
            default:
                return <MainMenu/>
        }
    }
}

//main
const loggerMiddleware = createLogger()

const reducer = combineReducers({
    selectedMenu,
    commandInfo,
    modelsBySubmodel    
})

const store = createStore(
    reducer,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
)

function render() {
    ReactDOM.render(<Main/>, document.getElementById("example"))
}
store.subscribe(render)
render()


