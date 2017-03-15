import * as React from "react";
import * as ReactDOM from "react-dom";
import * as I from '../interfaces/interfaces'
import * as K from '../constants/constants'
import {store} from '../reducers/reducers'
import * as T from '../thunk/functions'

export const ToMainMenuButton = () =>
    <button onClick = {()=>store.dispatch({type:K.SELECT_MENU, menu:K.MAIN_MENU})}>
    Back
    </button>

export const UpdateModelPanel = (item:any) =>
    <div>
        <button onClick={()=>{
            store.dispatch(T.postModels(JSON.stringify(item.item), K.IMAGE_SUBMODEL, item.Ref))}}>
            Update
        </button>
        <button onClick={()=>{store.dispatch(T.removeModel(JSON.stringify(item.item), K.IMAGE_SUBMODEL, item.Ref))}}>
            Delete
        </button>
        <button onClick={()=>{
            //bad
            store.dispatch(T.sendCommandWS(item, 
            K.URL_IMAGE_EDIT, K.COMMAND_TYPE_EDIT))}}>
            Edit
        </button>
        Status : {item.isActual? K.ACTUAL : K.NOT_ACTUAL}
    </div>

export const MainMenu = () =>
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

export const ImageMenu = (items:any[]) =>
    <div>
        <h2><p>Image Menu</p></h2>
        <ToMainMenuButton/>
            
        <button onClick = {() =>  
                store.dispatch(T.getModels(K.IMAGE_SUBMODEL))}>
        Update from remote app
        </button>
            
        <button onClick = {()=>
                store.dispatch(T.getModelsWS("Give me it", K.URL_IMAGE_UPDATE))}>
        Update from local app
        </button>
        <br/>
        {items.map((v, i)=>
            <div>
            <img src = {v.item.Data}/>
            {UpdateModelPanel(v)}
            </div> )
        }
    </div>

export const PrinterInfo = (item:any) =>
    <div>
        <h3><p>Printer Info : </p></h3>
        {Object.keys(item.item).map(m=><h3><p>{m.toString() + ' : ' + (item.item as any)[m]}</p></h3>)}
        <input ref = {node=>this.input=node}/>
        
        <button onClick = {() => {
            let mes = this.input.value
            this.input.value = ''
            store.dispatch(T.sendCommandWS(mes, K.URL_PRINTER_PRINT, K.COMMAND_TYPE_PRINT))}}>
        Print
        </button>
    </div>
        
export const PrinterMenu = (items:any[]) =>
    <div>
        <h2><p>Printer Menu</p></h2>
        
        <select onChange = {e=>store.dispatch({
            type:K.PICK_MODEL,
            submodel:K.PRINTER_SUBMODEL,
            picked:e.target.selectedIndex
        })}>
            {items.map(m=><option>{m.item.Name}</option>)}
        </select>

        <br/>
        <ToMainMenuButton/>

        <button onClick = {()=>
            store.dispatch(T.getModelsWS("Is printer there", K.URL_PRINTER_INFO)) 
        }>
        Update printers from local app
        </button>
        <br/>      
    </div>

export const ScanMenu = (/*items:any[]*/) =>
    <div>
        <h2><p>Scan Menu</p></h2>
        <ToMainMenuButton/>
        <button>
        Scan
        </button>
        <br/>      
    </div>