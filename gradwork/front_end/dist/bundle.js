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
	const React = __webpack_require__(1);
	const ReactDOM = __webpack_require__(2);
	const Hello_1 = __webpack_require__(3);
	ReactDOM.render(React.createElement(Hello_1.default, { url: "http://ankarenko-bridge.azurewebsites.net/api/productapi" }), document.getElementById("example"));


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
	const React = __webpack_require__(1);
	class Hello extends React.Component {
	    constructor(props) {
	        console.log("constructor");
	        super(props);
	        this.state = {
	            data: "Waiting"
	        };
	        this.get = this.get.bind(this);
	    }
	    componentWillMount() {
	        console.log("mount");
	        console.log(this);
	        this.get(this.props.url)
	            .then((response) => {
	            /*
	             Uncaught (in promise) TypeError: Cannot read property 'setState' of undefined
	                at get.then.err.setState.data
	            */
	            this.setState({ data: response });
	        }, function (err) {
	            this.setState({ data: err });
	        });
	    }
	    get(url) {
	        return new Promise(function (resolve, reject) {
	            var req = new XMLHttpRequest();
	            req.open('GET', url);
	            req.onload = function () {
	                if (req.status == 200) {
	                    resolve(req.response);
	                }
	                else {
	                    reject(Error(req.statusText));
	                }
	            };
	            req.onerror = function () { reject(Error("Network Error")); };
	            req.send();
	        });
	    }
	    render() {
	        console.log("constructor");
	        return (React.createElement("h1", null,
	            " Result : ",
	            this.state.data));
	    }
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Hello;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map