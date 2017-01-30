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

//ACTIONS
const RECEIVE_MODEL = 'RECEIVE_MODEL'
const SELECT_MODEL_TYPE = 'SELECT_MODEL_TYPE'
const REQUEST_MODEL = 'REQUEST_MODEL'

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
const modelTypeSelected = (state:string = 'text', action:any) => {
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

const rootReducer = combineReducers({
  modelTypeSelected,
  itemsByModel
})

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
const fetchPosts = (modelType:string) =>
    (dispatch:any) => { 
        dispatch(requestPosts(modelType))
    
        return fetch(`http://ankarenko-bridge.azurewebsites.net/api/productapi`)
               .then(response => response.text())
               //should be edited
               .then(json => dispatch(receivePosts(modelType, { mes: "super", data: JSON.parse(json)})))
    }


const loggerMiddleware = createLogger()

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
)


store.dispatch(selectedModelType('text'))
store.dispatch(fetchPosts('text')).then(() => console.log(store.getState()))
store.dispatch(fetchPosts('images')).then(() => console.log(store.getState()))

/*
ReactDOM.render(
    <Hello url = "http://ankarenko-bridge.azurewebsites.net/api/productapi" />,
    document.getElementById("example")
);*/