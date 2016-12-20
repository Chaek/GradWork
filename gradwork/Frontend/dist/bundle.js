/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var React = __webpack_require__(1);
	var ReactDOM = __webpack_require__(2);
	var requesttab_1 = __webpack_require__(3);
	var root = document.getElementById("example");
	ReactDOM.render(React.createElement(requesttab_1.RequestTab, { urlRemotePost: "http://scanbridge.azurewebsites.net/api/productapi/PostProduct", urlRemote: "http://scanbridge.azurewebsites.net/api/productapi", defaultName: "World" }), root);


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = ReactDOM;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// Remember to rename the file from app.ts to app.tsx
	// and to keep it in the src/ directory.
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	var requestform_1 = __webpack_require__(4);
	var requestcontent_1 = __webpack_require__(5);
	var root = document.getElementById("root");
	var RequestTab = (function (_super) {
	    __extends(RequestTab, _super);
	    function RequestTab(props) {
	        var _this = _super.call(this, props) || this;
	        _this.state = { name: _this.props.defaultName, data: "Hello World!" };
	        return _this;
	    }
	    RequestTab.prototype.httpGetSync = function () {
	        var xmlHttp = new XMLHttpRequest();
	        xmlHttp.open("GET", this.props.urlRemote, false); // false for synchronous request
	        xmlHttp.send(null);
	        this.setState({ data: xmlHttp.responseText });
	    };
	    RequestTab.prototype.httpPostSync = function () {
	        var data = {
	            ProductID: 0,
	            Name: "SuperName",
	            Description: "addedrec",
	            Category: "dasdas",
	            Price: 1
	        };
	        var xmlHttp = new XMLHttpRequest();
	        xmlHttp.open("POST", this.props.urlRemotePost, false); // false for synchronous request
	        xmlHttp.setRequestHeader("Content-type", "application/json");
	        xmlHttp.send(JSON.stringify(data));
	    };
	    RequestTab.prototype.wsGetSync = function () {
	        if ("WebSocket" in window) {
	            alert("WebSocket is supported by your Browser!");
	            // Let us open a web socket
	            var ws = new WebSocket("ws://localhost:80/GiveMeJson");
	            ws.onopen = function () {
	                // Web Socket is connected, send data using send()
	                ws.send("Message to send");
	                alert("Message is sent...");
	            };
	            ws.onmessage = function (evt) {
	                var received_msg = evt.data;
	                alert("Message is received...");
	                alert(received_msg);
	            };
	            ws.onclose = function () {
	                // websocket is closed.
	                alert("Connection is closed...");
	            };
	        }
	    };
	    RequestTab.prototype.render = function () {
	        var _this = this;
	        return (React.createElement("div", null,
	            React.createElement(requestform_1.default, { clickHandler: function () { return _this.httpGetSync(); }, buttonName: "GetRemote" }),
	            React.createElement(requestform_1.default, { clickHandler: function () { return _this.httpPostSync(); }, buttonName: "PostRemote" }),
	            React.createElement(requestform_1.default, { clickHandler: function () { return _this.wsGetSync(); }, buttonName: "GetLocal" }),
	            React.createElement(requestcontent_1.default, { name: this.state.name, data: this.state.data })));
	    };
	    return RequestTab;
	}(React.Component));
	exports.RequestTab = RequestTab;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// Remember to rename your file to Hello.tsx and
	// place it within your src/ directory
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	var RequestForm = (function (_super) {
	    __extends(RequestForm, _super);
	    function RequestForm(props) {
	        return _super.call(this, props) || this;
	    }
	    RequestForm.prototype.render = function () {
	        return (React.createElement("div", null,
	            React.createElement("button", { onClick: this.props.clickHandler }, this.props.buttonName)));
	    };
	    return RequestForm;
	}(React.Component));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = RequestForm;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	var RequestContent = (function (_super) {
	    __extends(RequestContent, _super);
	    function RequestContent(props) {
	        return _super.call(this, props) || this;
	    }
	    RequestContent.prototype.render = function () {
	        return (React.createElement("form", null,
	            React.createElement("div", null,
	                " ",
	                this.props.data,
	                " ")));
	    };
	    return RequestContent;
	}(React.Component));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = RequestContent;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map