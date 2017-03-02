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
    isFetching: boolean,
    isActual: boolean,
    items: string[]
    lastUpdated?: Date
}

interface IModelA extends IAction {
    model?:ResponseModel<any>,
    submodel:string
}

interface ISubmodelA extends IAction {
    submodel:string,
}

//Reducer
function models(state:IModelS = startModel, action:IModelA) {
    switch (action.type) {
        case RECEIVE_MODEL:
            switch (action.submodel) {
                case IMAGE_SUBMODEL:
                    let images:Image[] = action.model.data as Image[]
                    return { 
                        isFetching: false, 
                        isActual: true,
                        lastUpdated: Date.now(),
                        items: images.map(m => m.Data)
                    }
                case PRINTER_SUBMODEL:
                    let printers:Printer[] = action.model.data as Printer[]
                    return {
                        isFetching: false, 
                        isActual: true,
                        lastUpdated: Date.now(),
                        items: printers.map(m => m.Name)
                    }
                default:
                    return state
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
                <button onClick = {()=>{
                    store.dispatch({type:SELECT_SUBMODEL, submodel:PRINTER_SUBMODEL});
                }}>
                    Printer menu
                </button>
                
                <button onClick = {()=>{
                    store.dispatch({type:SELECT_SUBMODEL, submodel:IMAGE_SUBMODEL})
                }}>
                    Image menu
                </button>
            </div>
        );
    }
}

interface IImageProps {
    items:string[]
}

interface IPrinterProps {
    items:string[]
}

class ImageMenu extends React.Component<IImageProps, any> {
    public render() {
        return (
        <div>
            <br/>ImageMenu was invoked!<br/>
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
            {this.props.items.map(m =><img src = {m}/>)}
        </div>
        );
    }
}

class PrinterMenu extends React.Component<IPrinterProps, any> {
    public render() {
        return (
        <div>
        <br/>
            PrinterMenu was invoked! 
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

        </div>
        );
    }
}

//provider should be used instead
function renderManager() {
    let state:any = store.getState();
    let submodel:string = state.selectedSubmodel; 
    let items:string[] = (submodel in state.modelsBySubmodel)? 
        state.modelsBySubmodel[submodel].items : [];

    switch (submodel) {
        case PRINTER_SUBMODEL:
            ReactDOM.render(<PrinterMenu items = {items}/>, 
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