import * as I from '../interfaces/interfaces'

export const PICK_MODEL = 'PICK_MODEL'
export const RECEIVE_MODEL = 'RECEIVE_MODEL'
export const SELECT_SUBMODEL = 'SELECT_SUBMODEL'
export const REQUEST_MODEL = 'REQUEST_MODEL'
export const ADDED_MODEL = 'ADDED_MODEL'
export const IMAGE_SUBMODEL = 'IMAGE'
export const PRINTER_SUBMODEL = 'PRINTER'
export const URL_IMAGE_REMOTE = 'ws://localhost:8000/ImageUpdate'
export const URL_PRINTER_REMOTE = 'ws://localhost:8000/PrinterInfoUpdate'

export const IMAGE:number = 1;
export const PRINTER_INFO:number = 2;

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