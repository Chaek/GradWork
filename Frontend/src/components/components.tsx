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

/*
export const UpdateItemPanel = (data:any) =>
    <div>
        <button onClick={()=>
            store.dispatch(T.postItemBySubmodel(JSON.stringify(data.item), K.IMAGE_SUBMODEL, data.Ref))}>
            Update
        </button>
        <button onClick={()=>
            store.dispatch(T.removeItemBySubmodel(JSON.stringify(data.item), K.IMAGE_SUBMODEL, data.Ref))}>
            Delete
        </button>
        <button onClick={()=>{
            //bad
            store.dispatch(T.sendCommandWS(data, 
            K.URL_IMAGE_EDIT, K.COMMAND_TYPE_EDIT))}}>
            Edit
        </button>
        Status : {data.isActual? K.ACTUAL : K.NOT_ACTUAL}
    </div>
*/

export const ImageToolLocal = (record:any) =>
    <div>
        <button onClick={()=>
            store.dispatch(T.POST_IMAGE_REMOTE(record))}>
            Push
        </button>
        <button onClick={()=>store.dispatch({imageType:K.LOCAL_IMAGE, type:K.REMOVE, name:record.name})}>
            Delete
        </button>
        <button onClick={()=>store.dispatch(T.EDIT_ON_LOCAL(record))}>
            Edit
        </button>
    </div>

export const ImageToolRemote = (record:any) =>
    <div>
        <button onClick={()=>
            store.dispatch(T.POST_IMAGE_REMOTE(record))}>
            Pull
        </button>
        <button onClick={()=>store.dispatch(T.REMOVE_IMAGE_REMOTE(record))}>
            Delete
        </button>
    </div>


export const MainMenu = () =>
    <div>
        <h2><p>Main menu</p></h2>
    
        <button onClick = {()=>
                store.dispatch({type:K.SELECT_MENU, menu:K.PRINTER_MENU})}>
        Printer menu
        </button>

        <button onClick = {()=>
                store.dispatch({type:K.SELECT_MENU, menu:K.SCAN_MENU})}>
        Scan menu
        </button>

        <button onClick = {()=>
                store.dispatch({type:K.SELECT_MENU, menu:K.IMAGE_REMOTE_MENU})}>
        Image Records Remote Menu
        </button>

        <button onClick = {()=>
                store.dispatch({type:K.SELECT_MENU, menu:K.IMAGE_LOCAL_MENU})}>
        Image Records Local Menu
        </button>
    </div>

export const ImageRemoteMenu = (records:any[]) => 
    <div>
        <h2><p>Image Remote Menu</p></h2>
        <ToMainMenuButton/>

        <button onClick = {() => 
        store.dispatch(T.GET_IMAGE_RECORDS_REMOTE())}>
        Update from Remote
        </button>
            
        <br/>
        {records.map(r=>
            <div>
            <img key={r.name} src = {r.data}/>
            {ImageToolRemote(r)}
            </div>
            )
        }
    </div>

export const ImageLocalMenu = (records:any[]) => 
    <div>
        <h2><p>Image Local Menu</p></h2>
        <ToMainMenuButton/>

        <button onClick = {() => 
        store.dispatch(T.GET_IMAGE_RECORDS_LOCAL())}>
        Update from local
        </button>
            
        <br/>
        {records.map(r=>
            <div>
            <img key={r.name} src = {r.data}/>
            {ImageToolLocal(r)}
            </div>
        )}
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

   /*     
export const PrinterMenu = (items:any[]) =>
    <div>
        <h2><p>Printer Menu</p></h2>
        
        <select onChange = {e=>store.dispatch({
            type:K.PICK_MODEL,
            submodel:K.PRINTER_SUBMODEL,
            picked:e.target.selectedIndex
        })}>
            {items.map(m=><option>{m.item.name}</option>)}
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
*/
export const ScanMenu = (/*items:any[]*/) =>
    <div>
        <h2><p>Scan Menu</p></h2>
        <ToMainMenuButton/>
        <button>
        Scan
        </button>
        <br/>      
    </div>