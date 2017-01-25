import * as React from "react";
import * as ReactDOM from "react-dom";
import counter from './reducers/counter';
import {createStore} from 'redux'
import Hello  from "./components/Hello";


const store = createStore(counter);
store.subscribe(() => { 
    console.log(store.getState());
});

document.addEventListener('click', () => {
    store.dispatch({type: 'INCREMENT'})
})

ReactDOM.render(
    <Hello url = "http://ankarenko-bridge.azurewebsites.net/api/productapi" />,
    document.getElementById("example")
);