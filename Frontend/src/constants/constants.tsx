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

export const SELECT_MENU = 'SELECT_MENU'
export const IMAGE_MENU = 'IMAGE_MENU'
export const PRINTER_MENU = 'PRINTER_MENU'
export const MAIN_MENU = 'MAIN_MENU'
export const SCAN_MENU = 'SCAN_MENU'

export const IMAGE_SUBMODEL = 'IMAGE'
export const PRINTER_SUBMODEL = 'PRINTER'

export const URL_IMAGE_UPDATE = 'ws://localhost:8000/Images/Update'
export const URL_PRINTER_INFO = 'ws://localhost:8000/Printers/Info'
export const URL_PRINTER_PRINT = 'ws://localhost:8000/Printers/Print'

export const START_MODEL:I.ModelS = {
    isFetching: false,
    isActual: true,
    items: []
}
export const DEF_PRINTER_INFO:I.Printer = {
    Name: "Unknown",
    Status: "Unknown",
    IsDefault: false,
    IsNetworkPrinter: false
}