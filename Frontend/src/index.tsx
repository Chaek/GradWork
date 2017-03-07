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

function selectedSubmodel(state:string = K.IMAGE_SUBMODEL, action:I.SubmodelA) {
    switch (action.type) {
        case (K.SELECT_SUBMODEL):
            return action.submodel
        default:
            return state
    }
}

function modelsBySubmodel(state:any = {}, action:I.SubmodelA) {
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
                console.log(data)
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

class MainMenu extends React.Component<any, any> {
    public render() {
        return (
            <div>
                <h2><p>Main menu</p></h2>
                <button onClick = {()=>
                    store.dispatch({type:K.SELECT_SUBMODEL, submodel:K.PRINTER_SUBMODEL})
                }>
                    Printer menu
                </button>
                
                <button onClick = {()=>
                    store.dispatch({type:K.SELECT_SUBMODEL, submodel:K.IMAGE_SUBMODEL})
                }>
                    Image menu
                </button>
            </div>
        );
    }
}

class ImageMenu extends React.Component<I.ImageProps, any> {
    public render() {
        return (
        <div>
            <h2><p>Image Menu</p></h2>
            <button onClick = {()=>
                ReactDOM.render(<MainMenu/>, 
                document.getElementById("example"))}>
            Back</button>
            
            <button onClick = {() =>  
                    store.dispatch(getModels(K.IMAGE_SUBMODEL)) 
                }>
            Update from remote app
            </button>
            
            <button onClick = {()=>
                store.dispatch(getModelsWS("Give me it", K.URL_IMAGE_UPDATE))
            }>
            Update from local app
            </button>

            <br/>
            {this.props.items.map(m=><img src = {m.Data}/>)}
        </div>
        );
    }
}

class PrinterInfo extends React.Component<I.PrinterInfoProps, any> {
    public render() {
        //should be rewritten
        let casted:any = this.props.item as any
        console.log(this.props.item)
        return (
            <div>
                <h3><p>Printer Info : </p></h3>
                {Object.keys(this.props.item).map(m=><h3><p>{m.toString() + ' : ' + casted[m]}</p></h3>)}
            <button onClick = {() => {store.dispatch(getModelsWS("Give me it", K.URL_PRINTER_SCAN))}}>
                Scanning
            </button>
            </div>
        )
    }
}

class PrinterMenu extends React.Component<I.PrinterProps, any> {
    public render() {
        return (
        <div>
        <h2><p>Printer Menu</p></h2>
        
        <select onChange = {e=>store.dispatch({
            type:K.PICK_MODEL,
            submodel:K.PRINTER_SUBMODEL,
            picked:e.target.selectedIndex
        })}>
            {this.props.items.map(m=><option>{m.Name}</option>)}
        </select>

        <br/>
        <button onClick = {()=>
            ReactDOM.render(<MainMenu/>, 
            document.getElementById("example"))}>
        Back
        </button>

        <button onClick = {()=>
            store.dispatch(getModelsWS("Is printer there", K.URL_PRINTER_INFO)) 
        }>
        Update printers from local app
        </button>

        <br/>
        
        </div>
        );
    }
}

//provider should be used instead
function renderManager() {
    //should be rewritten
    let state:any = store.getState();
    let submodel:string = state.selectedSubmodel;
    let items:any[] = []
    let i = undefined 
    if (submodel in state.modelsBySubmodel) {
        items = state.modelsBySubmodel[submodel].items
        i = state.modelsBySubmodel[submodel].picked
    }
    switch (submodel) {
        case K.PRINTER_SUBMODEL:
            let item = (i === undefined)? K.DEF_PRINTER_INFO : items[i]

            ReactDOM.render(
            <div>
                <PrinterMenu items = {items}/>
                <PrinterInfo item = {item}/>
            </div>, 
            document.getElementById("example"));
            break;
        case K.IMAGE_SUBMODEL:
            ReactDOM.render(<ImageMenu items = {items}/>, 
            document.getElementById("example"));
            break;
        default:
            ReactDOM.render(<MainMenu/>, 
            document.getElementById("example"));
    }
}

//main
const loggerMiddleware = createLogger()

const reducer = combineReducers({
    selectedSubmodel,
    modelsBySubmodel    
})

const store = createStore(
    reducer,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
)

store.subscribe(renderManager)
ReactDOM.render(<MainMenu/>, document.getElementById("example"));


