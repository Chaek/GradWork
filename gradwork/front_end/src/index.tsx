import * as React from "react";
import * as ReactDOM from "react-dom";

import Hello  from "./components/Hello";

ReactDOM.render(
    <Hello url = "http://ankarenko-bridge.azurewebsites.net/api/productapi" />,
    document.getElementById("example")
);