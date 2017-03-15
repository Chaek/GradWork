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
import SingletonWS from './helpers/websocket'
import {store} from './reducers/reducers'
import * as T from './thunk/functions'
import * as C from './components/components'


//bad because it would get updated even if it's unnessessary
//should be used provider instead
class Main extends React.Component<any, any> {
    public render() {
        let state:any = store.getState();
        let menu = state.selectedMenu
        let items:any[] = []
        let item = undefined
        let i = undefined
        let status:string = ''

        switch (menu) {    
            case K.PRINTER_MENU:
                items = state.modelsBySubmodel[K.PRINTER_SUBMODEL].items
                //refference
                i = state.modelsBySubmodel[K.PRINTER_SUBMODEL].picked
                item = (i === undefined)? K.DEF_PRINTER_INFO : items[i]
                //console.log(items[i])
                return (
                    <div> 
                        {C.PrinterMenu (items)}
                        <C.PrinterInfo {...item}/>
                    </div>)
            case K.IMAGE_MENU:
                items = state.modelsBySubmodel[K.IMAGE_SUBMODEL].items
                    //bad
                return <div>{C.ImageMenu(items)}</div>
            case K.MAIN_MENU:
                return <C.MainMenu/>
            case K.SCAN_MENU:
                return <C.ScanMenu/>
            default:
                return <C.MainMenu/>
        }
    }
}


function render() {
    ReactDOM.render(<Main/>, document.getElementById("example"))
}

store.subscribe(render)
render()


