import * as React from "react";
import * as ReactDOM from "react-dom";
import * as fetch from 'isomorphic-fetch';
import { combineReducers } from 'redux'
import * as deepFreeze from 'deep-freeze';
import * as expect from 'expect';
import thunkMiddleware from 'redux-thunk';
import * as createLogger from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import * as websocket from 'ws'
//export const rootReducer
//export const runTests
 
 ///////////////////////////////////////////////////



var url = 'ws://localhost:8000/GiveImage';

function wsConnect(url:string) {
    return new Promise((resolve, reject)=>{
        var ws = new WebSocket(url);
        ws.onerror = (error) => {
            reject(error)
        }

        ws.onopen = () => {
            alert("Connected!");
            resolve(ws);
        }

        ws.onmessage = (msg) => {
            resolve(msg.data);
        }

        ws.onclose = () => {
            reject(new Error("Connection has been closed!"));
        }
    });
}

function wsFetch(msg:string, ws:WebSocket) {
    return new Promise((resolve, reject) => {
        ws.onmessage = (msg) => {
            resolve(msg.data);
        }

        ws.onerror = (error) => {
            reject(error)
        }

        ws.send(msg);
    });
}

wsConnect(url).then((ws:WebSocket) => wsFetch("Hello", ws)).then((msg)=>console.log(msg));
//////////////////////




interface Image {
    ID:number,
    Name:string,
    Data:string //byte array (images)
}

interface ResponseModel<T> {
    mes:string,
    type:number,
    data:T[]
}

interface IAction {
    type:string,
    model?:ResponseModel<Image>,
}

interface IState {
    isFetching: boolean,
    items: string[] //images
}

interface IAppProps {
    store:any
}

//ACTIONS
const RECEIVE_MODEL = 'RECEIVE_MODEL'
const SELECT_MODEL_TYPE = 'SELECT_MODEL_TYPE'
const REQUEST_MODEL = 'REQUEST_MODEL'
const ADDED_MODEL = 'ADDED_MODEL'

const defaultState:IState = {
    isFetching: false,
    items: []
}

//Reducer
function imageReducer(state:IState = defaultState, action:IAction) {
    switch (action.type) {
        case ADDED_MODEL:
        case RECEIVE_MODEL:
            return { isFetching: false, items: action.model.data.map(m => m.Data)}
        case REQUEST_MODEL:
            return Object.assign({}, state, {isFetching: true})
        default: 
            return state
    }
}

//Thunk function
function getImages(model:string) {
    return function (dispatch:any) { 
        dispatch({ type: REQUEST_MODEL })
        //return!!!
        return fetch(`http://ankarenko-bridge.azurewebsites.net/api/${model}/all`, {method:'GET', mode: 'cors'})
               .then(response => response.json())
               //why can't assign to ResponseModel<Image>?
               .then(json => dispatch({ type: RECEIVE_MODEL, model: json }))
               .catch(() => {})
    }
}

//main
const loggerMiddleware = createLogger()

const reducer = combineReducers({
    imageReducer
})

const imageStore = createStore(
  imageReducer,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
)


//imageStore.dispatch(getImages("image")).then(() => console.log("succeded!")) 

class App extends React.Component<IAppProps, any> {
    items:string[] //bad

    public render() {
        this.items = this.props.store.getState().items
        return (
            <div>
                <button onClick = {() => { 
                    this.props.store.dispatch(getImages('image')) 
                }}>
                Update
                </button>
                <br/>
                {this.items.map(val =><img src = {val}/>)}

            </div>
        );
    }
}

function render() { 
    ReactDOM.render(<App store = {imageStore}/>, 
                    document.getElementById("example")); 
}


imageStore.subscribe(render)
render();

/*




interface IResponseModel {
    mes:string,
    data:any[]
}

const selectedModelType = (modelType: string) => {
    return {
        type: SELECT_MODEL_TYPE,
        modelType
    }
}

const requestPosts = (modelType: string) => {
  return {
    type: REQUEST_MODEL,
    modelType
  }
}

const receivePosts = (modelType: string, response:IResponseModel) => {
  return {
    type: RECEIVE_MODEL,
    modelType,
    items: response.data,
    //receivedAt: Date.now()
  }
}

//REDUCERS
//any should be replaced on a normal type in the future
const modelTypeSelected = (state:string = 'product', action:any) => {
  switch (action.type) {
    case SELECT_MODEL_TYPE:
      return action.modelType;
    default:
      return state
  }
}

const items = (state:any = {
  isFetching: false,
  items: []
}, action:any) => {
  switch (action.type) {
    case REQUEST_MODEL:
      return Object.assign({}, state, {
        isFetching: true
      })
    case RECEIVE_MODEL:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.items
      })
    default:
      return state
  }
}

const itemsByModel = (state:any = {}, action:any) => {
  switch (action.type) {
    case REQUEST_MODEL:
    case RECEIVE_MODEL:
      return Object.assign({}, state, {
        [action.modelType]: items(state[action.modelType], action)
      })
    default:
      return state
  }
}

//TESTS
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


//thunk function
const fetchPosts = (model:string) =>
    (dispatch:any) => { 
        dispatch(requestPosts(model))
    
        return fetch(`http://ankarenko-bridge.azurewebsites.net/api/${model}`, {method:'GET'})
               .then(response => response.json())
               //should be edited
               .then((json:any) => {console.log("dasdsadas" + json); dispatch(receivePosts(model, { mes: "super", data: json.data}))})
    }

const deletePost = (modelType:string, id:number) =>
    (dispatch:any) => {
        dispatch(requestPosts(modelType))
        return fetch(`http://ankarenko-bridge.azurewebsites.net/api/product`, {method:'DELETE'})
                .then(()=>{console.log("Deleted"); fetchPosts(modelType)})
    }


class GetMenu extends React.Component<any, any> {
    private MODEL_OPTIONS:string[] = ["PRODUCT", "TEXT", "IMAGES"];
    private data:any[];
    private res:any;

    public render() {
        return (
            <div> Get Menu <br/>
                <select onChange = {val => this.props.store.dispatch(selectedModelType(val.target.value))}>
                    {this.MODEL_OPTIONS.map(option => <option>{option}</option>)}
                </select> 
                <button onClick = {()=> 
                    this.props.store.dispatch(fetchPosts(this.props.store.getState().modelTypeSelected))
                    .then(()=>{
                        this.data = this.props.store.getState().itemsByModel[this.props.store.getState().modelTypeSelected].items;
                        this.res = <ul>{this.data.map(val=><div><li>{val.Name}</li><button>Delete</button></div>)}</ul>
                        render();    
                        
                    })
                    }> Update </button>
                    {this.res}
            </div>
        )
    }    
}


class PostMenu extends React.Component<any, any> {
    public render() {
        return (
            <div> Post Menu </div>
        )
    }    
}

class MyApp extends React.Component<any, any> {
    private REQUEST_OPTIONS:string[] = ["POST", "GET"];
    private SERVER_OPTIONS:string[] = ["REMOTE", "LOCAL"];

    public render() {
        let request:string = this.props.store.getState().connectionParameters.request;
        let menu = (request == "POST")? <PostMenu/> : <GetMenu store={store}/>;

        return (
            <div>
                <select onChange = {val => this.props.store.dispatch({type: CHANGE_REQUEST_TYPE, data: val.target.value})}>
                    {this.REQUEST_OPTIONS.map(option => <option>{option}</option>)}
                </select>
                
                <select onChange = {val => this.props.store.dispatch({type: CHANGE_SERVER_TYPE, data: val.target.value})}>
                    {this.SERVER_OPTIONS.map(option => <option>{option}</option>)}
                </select>
                {menu}
            </div>
        );
    }    
}


//react REDUCERS
const CHANGE_REQUEST_TYPE = "CHANGE_REQUEST_TYPE";
const CHANGE_SERVER_TYPE = "CHANGE_SERVER_TYPE";
const connectionParameters = (state:any = {server:"REMOTE", request:"GET"}, action:any) => {
    switch (action.type) {
        case CHANGE_REQUEST_TYPE:
            return Object.assign({}, state, {request:action.data})
        case CHANGE_SERVER_TYPE:
            return Object.assign({}, state, {server:action.data})
        default:
            return state;
    }
}

const rootReducer = combineReducers({
  connectionParameters,
  modelTypeSelected,
  itemsByModel
})

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
)


const render = () => ReactDOM.render(<MyApp store = {store}/>, document.getElementById("example"));
render();
store.subscribe(render);
*/