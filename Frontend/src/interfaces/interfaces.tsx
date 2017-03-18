export interface Action {
    type:string, 
}

export interface Image {
    ID:number,
    Name:string,
    Data:string
}

export interface Printer {
    Name:string,
    Status:string,
    IsDefault:boolean,
    IsNetworkPrinter:boolean
}

export interface ResponseModel<T> {
    mes:string,
    type:number,
    data:T[]
}

export interface AppProps {
    store:any
}

export interface ImageProps {
    items:Image[]
}

export interface PrinterProps {
    items:Printer[]
}

export interface PrinterInfoProps {
    item: Printer
}

export interface ModelS {
    picked?:number,
    isFetching: boolean,
    items: string[]
    lastUpdated?: Date,
    Ref?:number
}

export interface ModelA extends Action {
    model?:ResponseModel<any>,
    picked?:number,
    actuality?:boolean,
    Ref?:number,
    item?:any,
    ID?:number
    //submodel:string
}

export interface SubmodelA extends Action {
    submodel:string,
}

export interface Item {
    ref:number
}

export interface CommandS {
    type:string,
    status:string,
    priority?:number
}

export interface CommandA extends Action {
    comType:string,
    status:string,
    priority?:number
}

export interface MenuA extends Action {
    menu:string
}