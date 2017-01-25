import * as React from "react";
import * as ReactDOM from "react-dom";
import counter from './reducers/counter';
import {createStore} from 'redux'
import Hello  from "./components/Hello";
import * as deepFreeze from 'deep-freeze';
import * as expect from 'expect';



/*
const store = createStore(counter);
store.subscribe(() => { 
    console.log(store.getState());
});

document.addEventListener('click', () => {
    store.dispatch({type: 'INCREMENT'})
})*/

let globalCounter:number = 0;

enum ActionType {
    INCREMENT = 1,
    DICREMENT
}

interface IDataState {
    value:number;
}

interface IDataAction {
    type: ActionType;
    value: number;
};

function data(state:IDataState[] = [], action:IDataAction) {
    switch (action.type) {
        case ActionType.INCREMENT:
            //state.push({value: action.value});
            return [...state, {value:action.value}];
        default:
            return state;
    }
}

const dataTests = () => {
    const before:IDataState[] = [];
    const after:IDataState[] = [{value: 1}];

    deepFreeze(before);
    expect(data(before, {type:ActionType.INCREMENT, value:1})).toEqual(after);
}

dataTests();
console.log("All tests passed");

const store = createStore(data);
store.subscribe(() => { 
    console.log(store.getState());
});

document.addEventListener('click', () => {
    store.dispatch({type: ActionType.INCREMENT, value: globalCounter})
    globalCounter++;
})














ReactDOM.render(
    <Hello url = "http://ankarenko-bridge.azurewebsites.net/api/productapi" />,
    document.getElementById("example")
);