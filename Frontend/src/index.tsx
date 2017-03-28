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
import {store} from './reducers/reducers'
import * as T from './thunk/functions'
import * as C from './components/components'
import RUN_ALL_TESTS from './tests/tests'
import * as Styles from './styles/styles'


RUN_ALL_TESTS()


//bad because it would get updated even if it's unnessessary
//should be used provider instead
class Main extends React.Component<any, any> {
    public render() {
        let state:any = store.getState();
        let data = []
        let images = []
        let printers = []
        let scanners = []
        let pickedPrinter = 0

        switch (state.selectedMenu) {    
            case K.MAIN_MENU:
                data = state.dataManager[K.SCANNER]
                scanners = (data !== undefined)? data.records : []
                switch (state.scanning.status) {
                    case K.SCANNING_PREPARE:
                        return <div>{C.ScanPanel(scanners)}<C.MainMenu/></div>
                    case K.SCANNING_NOTHING:
                        return <C.MainMenu/>
                }
            case K.IMAGE_LOCAL_MENU:
                data = state.dataManager[K.LOCAL_IMAGE]
                images = (data !== undefined)? data.records : []

                data =  state.dataManager[K.PRINTER]
                printers = (data !== undefined)? data.records : K.DEF_PRINTERS
                pickedPrinter = state.printing.picked

                switch (state.printing.status) {
                    case K.PRINTING_PREPARE:
                        return <div>{C.ImageLocalMenu(images, printers, state.printing.name, pickedPrinter)}</div>
                    case K.PRINTING_OK:
                        return <div>
                        {C.ImageRemoteMenu(images, printers, state.printing.name, pickedPrinter)}
                        {C.modalWindow("Succees")}
                        </div>
                    case K.PRINTING_ERROR:
                        return <div>
                            {C.ImageRemoteMenu(images, printers, state.printing.name, pickedPrinter)}
                            {C.modalWindow("Error")}
                        </div>
                    default:
                        return <div>{C.ImageLocalMenu(images, printers, "", pickedPrinter)}</div>    
                }
                
            case K.IMAGE_REMOTE_MENU:
                data = state.dataManager[K.REMOTE_IMAGE]
                images = (data !== undefined)? data.records : []
                
                data =  state.dataManager[K.PRINTER]
                printers = (data !== undefined)? data.records : K.DEF_PRINTERS
                pickedPrinter = state.printing.picked

                switch (state.printing.status) {
                    case K.PRINTING_PREPARE:
                        return <div>{C.ImageRemoteMenu(images, printers, state.printing.name, pickedPrinter)}</div>
                    case K.PRINTING_OK:
                        return <div>
                        {C.ImageRemoteMenu(images, printers, "", pickedPrinter)}
                        {C.modalWindow("Succees")}
                        </div>
                    case K.PRINTING_ERROR:
                        return <div>
                            {C.ImageRemoteMenu(images, printers, state.printing.name, pickedPrinter)}
                            {C.modalWindow("Error")}
                        </div>
                    default:
                        return <div>{C.ImageRemoteMenu(images, printers, "", pickedPrinter)}</div>    
                }
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

