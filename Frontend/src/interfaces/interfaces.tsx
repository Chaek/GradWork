export interface Image {
    id:number,
    name:string,
    data:string
}

export interface Printer {
    name:string,
    status:string,
    isDefault:boolean,
    isNetworkPrinter:boolean
}

export interface ResponseModel<T> {
    mes:string,
    type:string,
    data:T
}

export interface DataToPrint {
    printer:Printer,
    image:Image
}


