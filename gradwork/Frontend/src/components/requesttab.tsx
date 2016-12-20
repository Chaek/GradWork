// Remember to rename the file from app.ts to app.tsx
// and to keep it in the src/ directory.

import * as React from "react";
import * as ReactDOM from "react-dom";
import RequestForm from "./requestform";
import RequestContent from './requestcontent';

const root = document.getElementById("root");

export class RequestTab extends React.Component<IRequestTabProps, any> {
    constructor(props: IRequestTabProps){
        super(props);
        this.state = { name: this.props.defaultName, data: "Hello World!" };
    }

    public httpGetSync(): void
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", this.props.urlRemote, false ); // false for synchronous request
        xmlHttp.send( null );
        this.setState({data: xmlHttp.responseText});
    }

    public httpPostSync(): void
    {
        var data = {
            ProductID: 0,
            Name: "SuperName",
            Description: "addedrec",
            Category: "dasdas",
            Price: 1 

        };

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "POST", this.props.urlRemotePost, false ); // false for synchronous request
        xmlHttp.setRequestHeader("Content-type", "application/json");
        xmlHttp.send(JSON.stringify(data));
    }

    public wsGetSync() {
        if ("WebSocket" in window)
        {
           alert("WebSocket is supported by your Browser!");
              
            // Let us open a web socket
            var ws = new WebSocket("ws://localhost:80/GiveMeJson");
				
            ws.onopen = function()
            {
               // Web Socket is connected, send data using send()
                ws.send("Message to send");
                alert("Message is sent...");
            };
				
            ws.onmessage = function (evt) 
            { 
                var received_msg = evt.data;
                alert("Message is received...");
                alert(received_msg);
            };
				
            ws.onclose = function()
            { 
                // websocket is closed.
                alert("Connection is closed..."); 
            };
        }
    }

    public render() {
        return (
            <div>
                <RequestForm 
                    clickHandler = {() => this.httpGetSync()}
                    buttonName = "GetRemote"
                />
                <RequestForm 
                    clickHandler = {() => this.httpPostSync()}
                    buttonName = "PostRemote"
                />
                <RequestForm 
                    clickHandler = {() => this.wsGetSync()}
                    buttonName = "GetLocal"
                />
                <RequestContent 
                    name = { this.state.name }
                    data = { this.state.data }
                />
            </div>
        );
    }
}



