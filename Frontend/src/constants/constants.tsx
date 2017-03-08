import * as I from '../interfaces/interfaces'

export const PICK_MODEL = 'PICK_MODEL'
export const RECEIVE_MODEL = 'RECEIVE_MODEL'
export const SELECT_SUBMODEL = 'SELECT_SUBMODEL'
export const REQUEST_MODEL = 'REQUEST_MODEL'
export const PREPARE_COMMAND = 'EXECUTE_COMMAND'
export const RECEIVE_COMMAND_STATUS = 'RECEIVE_COMMAND_RESULT' 

export const SELECT_MENU = 'SELECT_MENU'
export const IMAGE_MENU = 'IMAGE_MENU'
export const PRINTER_MENU = 'PRINTER_MENU'
export const MAIN_MENU = 'MAIN_MENU'

export const IMAGE_SUBMODEL = 'IMAGE'
export const PRINTER_SUBMODEL = 'PRINTER'

export const URL_IMAGE_UPDATE = 'ws://localhost:8000/Images/Update'
export const URL_PRINTER_INFO = 'ws://localhost:8000/Printers/Info'
export const URL_PRINTER_SCAN = 'ws://localhost:8000/Printers/Scan'

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