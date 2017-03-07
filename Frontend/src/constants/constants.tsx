import * as I from '../interfaces/interfaces'

export const PICK_MODEL = 'PICK_MODEL'
export const RECEIVE_MODEL = 'RECEIVE_MODEL'
export const SELECT_SUBMODEL = 'SELECT_SUBMODEL'
export const REQUEST_MODEL = 'REQUEST_MODEL'

export const IMAGE_SUBMODEL = 'IMAGE'
export const PRINTER_SUBMODEL = 'PRINTER'

export const COMMAND_TO_SCAN = 'COMMAND_TO_SCAN'

export const URL_IMAGE_UPDATE = 'ws://localhost:8000/Image/Update'
export const URL_PRINTER_INFO = 'ws://localhost:8000/Printer/Info'
export const URL_PRINTER_SCAN = 'ws://localhost:8000/Printer/Scan'

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