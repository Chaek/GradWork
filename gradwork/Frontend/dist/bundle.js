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
	var scaninterface_1 = __webpack_require__(3);
	var root = document.getElementById("example");
	ReactDOM.render(React.createElement(scaninterface_1.default, null), root);


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

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	var optiontab_1 = __webpack_require__(4);
	var ScanInterface = (function (_super) {
	    __extends(ScanInterface, _super);
	    function ScanInterface(props) {
	        return _super.call(this, props) || this;
	    }
	    ScanInterface.prototype.render = function () {
	        var words = ["Example2", "Example1"];
	        return (React.createElement("form", null,
	            [1, 2, 3, 4].map(function (value) { return React.createElement(optiontab_1.default, { label: "Hello" + value.toString(), options: words }); }),
	            [1, 2, 3].map(function (value) { return React.createElement("div", null,
	                React.createElement("input", { type: "range" })); }),
	            [1, 2, 3].map(function (value) { return React.createElement("div", null,
	                React.createElement("input", { type: "checkbox" }),
	                " Test "); }),
	            React.createElement("button", null, "Scan")));
	    };
	    return ScanInterface;
	}(React.Component));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ScanInterface;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	var OptionTab = (function (_super) {
	    __extends(OptionTab, _super);
	    function OptionTab(props) {
	        return _super.call(this, props) || this;
	    }
	    OptionTab.prototype.render = function () {
	        return (React.createElement("form", null,
	            React.createElement("div", null,
	                " ",
	                this.props.label,
	                React.createElement("select", null, this.props.options.map(function (message) { return React.createElement("option", null, message); })))));
	    };
	    return OptionTab;
	}(React.Component));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = OptionTab;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map