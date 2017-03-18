import * as I from '../interfaces/interfaces'

export const PICK_MODEL = 'PICK_MODEL'
export const RECEIVE_MODEL_LOCAL = 'RECEIVE_MODEL_LOCAL'
export const RECEIVE_MODEL_REMOTE = 'RECEIVE_MODEL_REMOTE'
export const SELECT_SUBMODEL = 'SELECT_SUBMODEL'
export const REQUEST_MODEL = 'REQUEST_MODEL'
export const PREPARE_COMMAND = 'EXECUTE_COMMAND'
export const RECEIVE_COMMAND_STATUS = 'RECEIVE_COMMAND_RESULT'
export const LOAD_MODEL_TO_SERVER = 'LOAD_MODEL_TO_SERVER' 
export const CHANGE_ACTUALITY = 'CHANGE_ACTUALITY'
export const CLEAR_SUBMODEL = 'CLEAR_SUBMODEL'
export const REMOVE_ITEM = 'REMOVE_ITEM'
export const UPDATE_ITEM = 'UPDATE_ITEM'
export const ITEM_CHANGE_ACTUALITY = 'ITEM_CHANGE_ACTUALITY' 

export const SELECT_MENU = 'SELECT_MENU'
export const IMAGE_MENU = 'IMAGE_MENU'
export const PRINTER_MENU = 'PRINTER_MENU'
export const MAIN_MENU = 'MAIN_MENU'
export const SCAN_MENU = 'SCAN_MENU'

export const IMAGE_SUBMODEL = 'IMAGE'
export const PRINTER_SUBMODEL = 'PRINTER'

export const URL_IMAGE_EDIT = 'ws://localhost:8000/Images/Edit'
export const URL_IMAGE_UPDATE = 'ws://localhost:8000/Images/Update'
export const URL_PRINTER_INFO = 'ws://localhost:8000/Printers/Info'
export const URL_PRINTER_PRINT = 'ws://localhost:8000/Printers/Print'
export const COMMAND_STATUS_NOTHING = 'COMMAND_STATUS_NOTHING'
export const COMMAND_STATUS_FAIL = 'COMMAND_STATUS_NOTHING'
export const COMMAND_STATUS_OK = 'COMMAND_STATUS_OK'
export const COMMAND_STATUS_WAITING = 'COMMAND_STATUS_WAITING'

export const COMMAND_TYPE_NOTHING = 'COMMAND_TYPE_NOTHING'
export const COMMAND_TYPE_PRINT = 'COMMAND_TYPE_PRINT'
export const COMMAND_TYPE_SCAN = 'COMMAND_TYPE_SCAN'
export const COMMAND_TYPE_WAITING = 'COMMAND_TYPE_WAITING'
export const COMMAND_TYPE_EDIT = 'COMMAND_TYPE_EDIT'

export const ACTUAL = 'ACTUAL'
export const NOT_ACTUAL = 'NOT ACTUAL'

export const OK = 'OK'


export const START_MODEL:I.ModelS = {
    isFetching: false,
    items: []
}
export const DEF_PRINTER_INFO:any = {
    Ref:0,
    isActual:true,
    item: {
        Name: "Unknown",
        Status: "Unknown",
        IsDefault: false,
        IsNetworkPrinter: false
    }
}

export const START_COMMANDS:I.CommandS = {
    type:COMMAND_TYPE_NOTHING,
    status:COMMAND_STATUS_WAITING,
}

export const mes:any = {
    mes:'hello',
    sender:'frontend'
}