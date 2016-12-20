import * as React from "react";
import * as ReactDOM from "react-dom";

import { RequestTab } from "./components/requesttab"

const root = document.getElementById("example");
ReactDOM.render(
    <RequestTab
        urlRemotePost = "http://scanbridge.azurewebsites.net/api/productapi/PostProduct"
        urlRemote = "http://scanbridge.azurewebsites.net/api/productapi"
        defaultName = "World"
    />, root
);