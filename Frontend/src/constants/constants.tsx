import * as I from '../interfaces/interfaces'

export const OK = 'OK'
export const ERROR = 'ERROR'

export const DEF_PRINTERS:any = [
    {
        name: "Unknown",
        status: "Unknown",
        isDefault: false,
        isNetworkPrinter: false
    }
]

//REDUCER CONSTANTS
//DATA ACTIONS
export const RECIEVE = 'RECIEVE'
export const REQUEST = 'REQUEST'
export const REMOVE = 'REMOVE'
export const ADD = 'ADD'

//Data types
export const REMOTE_IMAGE = 'REMOTE_IMAGE'
export const LOCAL_IMAGE = 'LOCAL_IMAGE'
export const PRINTER = 'PRINTER'
export const SCANNER = 'SCANNER'

//Print status
export const PRINTING_NOTHING = 'PRINTING_NOTHING'
export const PRINTING_PREPARE = 'PRINTING_PREPARE'
export const PRINTING_PRINT = 'PRINTING_PRINT'
export const PRINTING_ERROR = 'ERROR'
export const PRINTING_OK = 'OK'

//Print REDUCER
export const PRINTING_COMPLETE = 'PRINTING_COMPLETE'
export const PRINTING_PICK_PRINTER = 'PRINTING_PICK_PRINTER'
export const PRINTING_PREPARE_TO_PRINT = 'PRINTING_PREPARE_TO_PRINT'

//SELECT_MENU
//action types
export const SELECT_MENU = 'SELECT_MENU'

//menu types
export const MAIN_MENU = 'MAIN_MENU'
export const IMAGE_REMOTE_MENU = 'IMAGE_REMOTE_MENU'
export const IMAGE_LOCAL_MENU = 'IMAGE_LOCAL_MENU'

//SCAN REDUCER
//status
export const SCANNING_NOTHING = 'SCANNING_NOTHING'
export const SCANNING_PREPARE = 'SCANNING_PREPARE'
export const SCANNING_WAITING = 'SCANNING_WAITING'
export const SCANNING_OK = 'OK'
export const SCANNING_ERROR = 'ERROR'

//types
export const SCANNING_RECIEVE_OK = 'SCANNING_RECIEVE_OK'
export const SCANNING_RECIEVE_ERROR = 'SCANNING_RECIEVE_ERROR'

export const SCANNING_COMPLETE = 'SCANNING_COMPLETE'
export const SCANNING_PREPARE_TO_SCAN = 'SCANNING_PREPARE_TO_SCAN'
export const SCANNING_WAIT = 'SCANNING_WAIT'

