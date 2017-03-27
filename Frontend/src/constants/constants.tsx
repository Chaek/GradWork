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

//Print status
export const PRINTING_NOTHING = 'NOTHING'
export const PRINTING_PREPARE = 'PREPARE'
export const PRINTING_PRINT = 'PRINTING'
export const PRINTING_ERROR = 'ERROR'
export const PRINTING_OK = 'OK'

//Print REDUCER
export const PRINTING_CHANGE_STATUS = 'CHANGE_STATUS'
export const PRINTING_PICK_PRINTER = 'PICK_PRINTER'

//SELECT_MENU
//action types
export const SELECT_MENU = 'SELECT_MENU'

//menu types
export const MAIN_MENU = 'MAIN_MENU'
export const IMAGE_REMOTE_MENU = 'IMAGE_REMOTE_MENU'
export const IMAGE_LOCAL_MENU = 'IMAGE_LOCAL_MENU'