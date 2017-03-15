export default class SingletonWS {
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
            .then(response=>resolve((response as any).data))
            .catch(err=>reject(err))
        }) 
    }
}