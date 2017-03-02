import * as React from "react";
import * as ReactDOM from "react-dom";
import * as fetch from 'isomorphic-fetch';
import { combineReducers } from 'redux'
import * as deepFreeze from 'deep-freeze';
import * as expect from 'expect';
import thunkMiddleware from 'redux-thunk';
import * as createLogger from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
//export const rootReducer
//export const runTests

interface IAction {
    type:string, 
}

interface Image {
    ID:number,
    Name:string,
    Data:string
}

interface Printer {
    Name:string,
    Status:string,
    IsDefault:boolean,
    IsNetworkPrinter:boolean
}

interface ResponseModel<T> {
    mes:string,
    type:number,
    data:T[]
}

interface IAppProps {
    store:any
}

//ACTIONS
const PICK_MODEL = 'PICK_MODEL'
const RECEIVE_MODEL = 'RECEIVE_MODEL'
const SELECT_SUBMODEL = 'SELECT_SUBMODEL'
const REQUEST_MODEL = 'REQUEST_MODEL'
const ADDED_MODEL = 'ADDED_MODEL'
const IMAGE_SUBMODEL = 'IMAGE'
const PRINTER_SUBMODEL = 'PRINTER'
const URL_IMAGE_REMOTE = 'ws://localhost:8000/ImageUpdate'
const URL_PRINTER_REMOTE = 'ws://localhost:8000/PrinterInfoUpdate'

const IMAGE:number = 1;
const PRINTER_INFO:number = 2;

const startModel:IModelS = {
    isFetching: false,
    isActual: true,
    items: []
}

interface IModelS {
    picked?:number,
    isFetching: boolean,
    isActual: boolean,
    items: string[]
    lastUpdated?: Date
}

interface IModelA extends IAction {
    model?:ResponseModel<any>,
    picked?:number
    //submodel:string
}

interface ISubmodelA extends IAction {
    submodel:string,
}

//Reducer
function models(state:IModelS = startModel, action:IModelA) {
    switch (action.type) {
        case PICK_MODEL:
            return Object.assign({}, state, { picked: action.picked })
        case RECEIVE_MODEL:
            return { 
                picked: 0,
                isFetching: false, 
                isActual: true,
                lastUpdated: Date.now(),
                items: action.model.data.map(m => m)
            }
        case REQUEST_MODEL:
            return Object.assign({}, state, { isFetching: true })
        default: 
            return state
    }
}

function selectedSubmodel(state:string = IMAGE_SUBMODEL, action:ISubmodelA) {
    switch (action.type) {
        case (SELECT_SUBMODEL):
            return action.submodel
        default:
            return state
    }
}

function modelsBySubmodel(state:any = {}, action:ISubmodelA) {
    switch (action.type) {
        case PICK_MODEL:
        case RECEIVE_MODEL:
        case REQUEST_MODEL:
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
            case PRINTER_SUBMODEL:
            case IMAGE_SUBMODEL:
                console.log(data)
                store.dispatch({submodel:data.type, type: RECEIVE_MODEL, model: data })
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
        dispatch({ type: REQUEST_MODEL })
        return SingletonWS.getInstance().send(mes, url)
    }
}

function getModels(submodel:string) {
    return function(dispatch:any) { 
        dispatch({ type: REQUEST_MODEL })
        return fetch(`http://ankarenko-bridge.azurewebsites.net/api/${submodel.toLowerCase()}/all`)
               .then(response => response.json())
               //why can't assign to ResponseModel<Image>?
               .then(json => dispatch({ submodel, type: RECEIVE_MODEL, model: json }))
               .catch(() => {})
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

class MainMenu extends React.Component<any, any> {
    public render() {
        return (
            <div>
                <p>MainMenu was invoked!</p>
                <button onClick = {()=>
                    store.dispatch({type:SELECT_SUBMODEL, submodel:PRINTER_SUBMODEL})
                }>
                    Printer menu
                </button>
                
                <button onClick = {()=>
                    store.dispatch({type:SELECT_SUBMODEL, submodel:IMAGE_SUBMODEL})
                }>
                    Image menu
                </button>
            </div>
        );
    }
}

interface IImageProps {
    items:Image[]
}

interface IPrinterProps {
    items:Printer[]
}

interface IPrinterInfoProps {
    item: Printer
}

class ImageMenu extends React.Component<IImageProps, any> {
    public render() {
        return (
        <div>
            <p>ImageMenu was invoked!</p>
            <button onClick = {()=>
                ReactDOM.render(<MainMenu/>, 
                document.getElementById("example"))}>
            Back</button>
            
            <button onClick = {() =>  
                    store.dispatch(getModels(IMAGE_SUBMODEL)) 
                }>
            Update from remote app
            </button>
            
            <button onClick = {()=>
                store.dispatch(getModelsWS("Give me it", URL_IMAGE_REMOTE))
            }>
            Update from local app
            </button>

            <br/>
            {this.props.items.map(m=><img src = {m.Data}/>)}
        </div>
        );
    }
}

class PrinterInfo extends React.Component<IPrinterInfoProps, any> {
    public render() {
        //should be rewritten
        let casted:any = this.props.item as any
        console.log(this.props.item)
        return (
            <div>
                <p>Printer Info was invoked!</p>
                {Object.keys(this.props.item).map(m=><p><h3>{m.toString() + ' : ' + casted[m]}</h3></p>)}
            </div>
        )
    }
}

class PrinterMenu extends React.Component<IPrinterProps, any> {
    public render() {
        return (
        <div>
        <p>PrinterMenu was invoked!</p>
        
        <select onChange = {e=>store.dispatch({
            type:PICK_MODEL,
            submodel:PRINTER_SUBMODEL,
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
            store.dispatch(getModelsWS("Give me it", URL_PRINTER_REMOTE)) 
        }>
        Update printers from local app
        </button>

        <br/>

        </div>
        );
    }
}

const DEF_PRINTER_INFO:Printer = {
    Name: "Unknown",
    Status: "Unknown",
    IsDefault: false,
    IsNetworkPrinter: false
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
        case PRINTER_SUBMODEL:
            let item = (i === undefined)? DEF_PRINTER_INFO : items[i]

            ReactDOM.render(
            <div>
                <PrinterMenu items = {items}/>
                <PrinterInfo item = {item}/>
            </div>, 
            document.getElementById("example"));
            break;
        case IMAGE_SUBMODEL:
            ReactDOM.render(<ImageMenu items = {items}/>, 
            document.getElementById("example"));
            break;
        default:
            ReactDOM.render(<MainMenu/>, 
            document.getElementById("example"));
    }
}

store.subscribe(renderManager)
ReactDOM.render(<MainMenu/>, document.getElementById("example"));


//TESTS
/*
const test_modelTypeSelected = () => {
    let stateBefore = "text";
    let stateAfter = "text";
    let action = selectedModelType("text")

    deepFreeze(stateBefore);
    expect(modelTypeSelected(stateBefore, action)).toEqual(stateAfter);
}

const test_items = () => {
    //initialization
    let stateBefore:any = { 
        isFetching: false,
        items: []
    }

    deepFreeze(stateBefore);

    //REQUEST_MODEL
    let stateAfter:any = {
        isFetching: true,
        items: []
    }

    let action = requestPosts("text");
    expect(items(stateBefore, action)).toEqual(stateAfter);

    //RECEIVE_MODEL
    const json:string = '{"mes": "Hello", "data" : [{"a":1}, {"b":"hello"}]}';
    const inModel:IResponseModel = JSON.parse(json);

    stateAfter = {
        isFetching: false,
        items: [{a:1}, {b:"hello"}]
    }

    action = receivePosts("text", inModel);
    expect(items(stateBefore, action)).toEqual(stateAfter);
}

const test_itemsByModel = () => {
    //initialization
    let stateBefore:any = { 
        images: {
            isFetching:true,
            items: []
        },

        emails: {
            isFetching:false,
            items: [1, 2, 3, 4]
        },

        text: {
            isFetching: false,
            items: ["hello", "Bye", "How are you?"]
        }
    }

    deepFreeze(stateBefore);

    //REQUEST_MODEL
    let stateAfter:any = {
        images: {
            isFetching:true,
            items: []
        },

        emails: {
            isFetching:false,
            items: [1, 2, 3, 4]
        },

        text: {
            isFetching: true,
            items: ["hello", "Bye", "How are you?"]
        }
    }

    let action = requestPosts("text");
    expect(itemsByModel(stateBefore, action)).toEqual(stateAfter);

    //RECEIVE_MODEL
}

const runTests = () => {
    test_modelTypeSelected();
    test_items();
    test_itemsByModel();
    console.log("All tests have been passed");
}

*/