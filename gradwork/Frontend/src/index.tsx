import * as React from "react";
import * as ReactDOM from "react-dom";

import { RequestTab } from "./components/requesttab"
import ScanInterface from "./components/scaninterface"

const root = document.getElementById("example");

ReactDOM.render(
    <ScanInterface />
    
    /*
    <RequestTab
        urlRemotePost = "http://ankarenko-bridge.azurewebsites.net/api/productapi/PostProduct"
        urlRemote = "http://ankarenko-bridge.azurewebsites.net/api/productapi"
        defaultName = "World"
    />*/, root
);