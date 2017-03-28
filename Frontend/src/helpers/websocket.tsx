import * as K from '../constants/constants'

//CONTROLLERS
export const IMAGE_CONTROLLER = 'Images'
export const PRINTER_CONTROLLER = 'Printers'
export const SCANNER_CONTROLLER = 'Scanners'


//ADDRESSES
export const LOCAL_APP_ADDRESS = 'ws://localhost:8000/'

//METHODS
export const METHOD_GET_ALL = '/Update'
export const METHOD_EDIT = '/Edit'
export const METHOD_INFO = '/Info'
export const METHOD_PRINT = '/Print'
export const METHOD_SCAN = '/Scan'

export class SingletonWS {
    
    private static instance:SingletonWS
    private static ws:WebSocket = null

    private constuctor() {}

    public static getInstance() {
        if (!SingletonWS.instance) {
            SingletonWS.instance = new SingletonWS()
        }
        return SingletonWS.instance;
    }

    private connect(url:string) {
        return new Promise((resolve, reject) => {
            SingletonWS.ws = new WebSocket(url)
            
            SingletonWS.ws.onerror = (err:ErrorEvent) => {
                reject("Error : " + err.error)
                SingletonWS.ws.close();
            }

            SingletonWS.ws.onopen = () => {
                console.log("Connected to local app")
                resolve()
            }

            SingletonWS.ws.onclose = () => {
                console.log("Connection with local app is lost")
            }

            
        }); 
    }

    private sendWS(mes:string) {
        return new Promise((resolve, reject) => {
            SingletonWS.ws.onmessage = (msg:MessageEvent) => {
                resolve(msg)
                //SingletonWS.ws.close()
            }

            SingletonWS.ws.send(mes)
        })
    }

    public send(mes:string, url:string) {
        return new Promise((resolve, reject)=>{
            this.connect(url)
            .then(()=>this.sendWS(mes))
            .then(response=>{
                let res = JSON.parse((response as any).data)
                if ((res as any).mes == K.OK) {
                    resolve(res)
                } else {
                    reject(res)
                }
            })
        }) 
    }
}