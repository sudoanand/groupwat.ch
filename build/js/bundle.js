var GWatch =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build/js/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/GWatch.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/GWatch.js":
/*!**************************!*\
  !*** ./src/js/GWatch.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Gwatch\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * A controller class for the vidoe player and index page functionalities\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Anand Singh <@hack4mer> https://anand.today\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */\n\n\nvar _VideoPlayer = __webpack_require__(/*! ./VideoPlayer */ \"./src/js/VideoPlayer.js\");\n\nvar _jquery = __webpack_require__(/*! jquery */ \"jquery\");\n\nvar _jquery2 = _interopRequireDefault(_jquery);\n\nvar _Socket = __webpack_require__(/*! ./Socket */ \"./src/js/Socket.js\");\n\nvar _Utilities = __webpack_require__(/*! ./Utilities */ \"./src/js/Utilities.js\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\n/**\n * GWatch constructor\n * @param {object} options configuration object for the GroupWat.ch player\n */\nvar GWatch = function () {\n    function GWatch(options) {\n        _classCallCheck(this, GWatch);\n\n        //options and config\n        this.config = {\n            videoId: options.videoId || 'my-video',\n            videoSelector: options.videoSelector || (0, _jquery2.default)(\"#video-selector\"),\n            videoSrcElement: options.videoSrcElement || (0, _jquery2.default)(\"#my-video-src\"),\n            devmode: options.devmode || false,\n            socket_server: options.socket_server || window.location.hostname,\n            socket_port: options.socket_port || 12345\n        };\n\n        //A placeholder for an instance of the VideoPlayer\n        this.video = null;\n\n        //show the video player\n        (0, _jquery2.default)(\"#my-video\").show();\n\n        //Attach jQuery UI events to the dom elements\n        this.initializeUIEvents();\n\n        //Set utility options\n        _Utilities.Utilities.logging = this.config.devmode; // If the logs should appera in the console\n        _Utilities.Utilities.session_identifier = this.generateConnectionId(); //A unique identifier for the socket connection    \n        _Utilities.Utilities.websocket = new _Socket.Socket(this.config.socket_server, this.config.socket_port).websocket; //Initialize the socket class    \n    }\n\n    /**\n     * Initializes jQuery events to the DOM elements\n     */\n\n\n    _createClass(GWatch, [{\n        key: 'initializeUIEvents',\n        value: function initializeUIEvents() {\n\n            _Utilities.Utilities.log(\"Initializing UI events\");\n\n            //on video src change\n            this.config.videoSelector.change(this.onSrcSelected.bind(this));\n        }\n\n        /**\n         * Event handler for the change in video selector input file \n         */\n\n    }, {\n        key: 'onSrcSelected',\n        value: function onSrcSelected(e) {\n\n            var file = e.target.files[0],\n                fileUrl = window.URL.createObjectURL(file);\n\n            _Utilities.Utilities.log(\"New source file selected\");\n\n            //Configure the player to use newly selected source\n            this.changePlayerSource(fileUrl);\n        }\n\n        /**\n        * Changes video source and configures the player to use it\n        * @param  {string} newSrc the new video source to be applied\n        */\n\n    }, {\n        key: 'changePlayerSource',\n        value: function changePlayerSource(newSrc) {\n\n            _Utilities.Utilities.log(\"Changing player's source\");\n\n            //Change src element\n            this.config.videoSrcElement.attr(\"src\", newSrc);\n\n            if (typeof _Utilities.Utilities.player == \"undefined\") {\n\n                //Initialize video player\n                _Utilities.Utilities.video = new _VideoPlayer.VideoPlayer();\n                _Utilities.Utilities.player = _Utilities.Utilities.video.player;\n            } else {\n\n                //Video player already initialized\n                //Change video player source\n                _Utilities.Utilities.player.src({ type: 'video/mp4', src: newSrc });\n                _Utilities.Utilities.player.load();\n            }\n        }\n\n        /**\n        * Generates a random string to use as an identifier for the socket connection\n        * @return {[type]} [description]\n        */\n\n    }, {\n        key: 'generateConnectionId',\n        value: function generateConnectionId() {\n            var date = new Date();\n            return btoa(unescape(encodeURIComponent(date.getTime() + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)))).slice(0, -2);\n        }\n    }]);\n\n    return GWatch;\n}();\n\nmodule.exports = GWatch;\n\n//# sourceURL=webpack://GWatch/./src/js/GWatch.js?");

/***/ }),

/***/ "./src/js/Socket.js":
/*!**************************!*\
  !*** ./src/js/Socket.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.Socket = undefined;\n\nvar _jquery = __webpack_require__(/*! jquery */ \"jquery\");\n\nvar _jquery2 = _interopRequireDefault(_jquery);\n\nvar _Utilities = __webpack_require__(/*! ./Utilities */ \"./src/js/Utilities.js\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n/**\n * socket constructor\n * @param  {string} SOCKET_SERVER Hostname of the socket server\n */\n/**\n * Socket.js\n * A controller for the WebSocket events and communications\n * @author Anand Singh <@hack4mer> https://anand.today\n */\n\nvar Socket = exports.Socket = function Socket(socket_server, socket_port) {\n\n  var port = socket_port || 12345;\n\n  this.wsUri = \"ws://\" + socket_server + \":\" + socket_port;\n  this.websocket = new WebSocket(this.wsUri);\n  this.msgBox = (0, _jquery2.default)('#log');\n\n  this.websocket.onopen = this.onConnected.bind(this);\n  this.websocket.onmessage = this.onMessage;\n  this.websocket.onerror = this.onError.bind(this);\n  this.websocket.onclose = this.onError.bind(this);\n};\n\nSocket.prototype.onConnected = function (ev) {\n  // connection is open \n  this.msgBox.html('<div class=\"system_msg\" style=\"color:#bbbbbb\">Socket connected, Connection id: ' + _Utilities.Utilities.session_identifier + '</div>'); //notify user\n};\n\nSocket.prototype.onMessage = function (ev) {\n\n  var response = JSON.parse(ev.data); //PHP sends Json data\n\n\n  if (response.name == _Utilities.Utilities.session_identifier || !_Utilities.Utilities.video) {\n    //This is a message from self\n    //or the video is not initialized yet\n    //Hence, ignore\n    return;\n  }\n\n  //Do not notify others about this seek event since it was triggered by someone else\n  _Utilities.Utilities.video.notifyPeers = false;\n\n  _Utilities.Utilities.log(\"Socket message received:\", _Utilities.Utilities.video.notifyPeers);\n  if (_Utilities.Utilities.logging) {\n    console.log(response);\n  }\n\n  if (response.key == \"seek_value\") {\n\n    _Utilities.Utilities.player.currentTime(response.value.time); //Seek the video\n\n    if (response.value.play) {\n      _Utilities.Utilities.player.play(); //Play if the peers video is playing\n    }\n  } else if (response.key == \"pause\" && !_Utilities.Utilities.player.paused()) {\n\n    //Pause the video as requested by the peer\n    _Utilities.Utilities.player.pause();\n  } else if (response.key == \"play\" && _Utilities.Utilities.player.paused()) {\n\n    //Play the video as requested by the peer\n    _Utilities.Utilities.player.play();\n  } else {\n\n    //Remove the notification lock\n    _Utilities.Utilities.video.notifyPeers = true;\n  }\n};\n\n/**\n * Socket connection error handler\n * @param  {event} ev event object \n */\nSocket.prototype.onError = function (ev) {\n  this.msgBox.html('<div class=\"system_msg\" style=\"color:red\">Socket connection lost/failed! reload the page to retry...</div>');\n};\n\n//# sourceURL=webpack://GWatch/./src/js/Socket.js?");

/***/ }),

/***/ "./src/js/Utilities.js":
/*!*****************************!*\
  !*** ./src/js/Utilities.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\n/**\n * Utility functions and global variables for the project\n */\n\nvar Utilities = exports.Utilities = function () {\n  function Utilities() {\n    _classCallCheck(this, Utilities);\n\n    this.logging = false;\n  }\n\n  /**\n   * Simple method to log debug messages with a predefined tag \n      */\n\n\n  _createClass(Utilities, null, [{\n    key: \"log\",\n    value: function log() {\n\n      if (!this.logging) {\n        return;\n      } //Disabled when not in devmode\n\n      console.log(\"GWatch: \", [].slice.call(arguments).join(\",\"));\n    }\n  }]);\n\n  return Utilities;\n}();\n\n//# sourceURL=webpack://GWatch/./src/js/Utilities.js?");

/***/ }),

/***/ "./src/js/VideoPlayer.js":
/*!*******************************!*\
  !*** ./src/js/VideoPlayer.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.VideoPlayer = undefined;\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * VideoPlayer\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * A controller class for the VideoJS player events\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * All the socket notifications are sent by this class\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Ananad <@hack4mer> https://anand.today\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */\n\nvar _video = __webpack_require__(/*! video.js */ \"video.js\");\n\nvar _video2 = _interopRequireDefault(_video);\n\nvar _Utilities = __webpack_require__(/*! ./Utilities */ \"./src/js/Utilities.js\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\n/**\n * Constructor for the videoJS player controller\n */\nvar VideoPlayer = exports.VideoPlayer = function () {\n  function VideoPlayer() {\n    _classCallCheck(this, VideoPlayer);\n\n    var options = {};\n\n    this.lastSeekValue = 0;\n    this.videoSeeking = 0;\n\n    //Decides wether to send event notification to others through the socket   \n    this.notifyPeers = true;\n\n    //Initialize the videojs player\n    this.player = (0, _video2.default)('my-video', options, this.onPlayerReady.bind(this));\n\n    //Add subtitle button\n    this.addNewButton({\n      \"id\": \"addSubsBtn\",\n      \"icon\": \"icon-speech\"\n    }, this.onAddSubBtnClicked.bind(this));\n  }\n\n  /**\n   * Adds new button to the player\n   * @param {object} data an object with valid keys : icon,id\n   * @param {function} onClickListener A click listener for the added button\n   */\n\n\n  _createClass(VideoPlayer, [{\n    key: 'addNewButton',\n    value: function addNewButton(data, onClickListener) {\n\n      var myPlayer = this.player,\n          controlBar,\n          insertBeforeNode,\n          newElement = document.createElement('div'),\n          newLink = document.createElement('a');\n\n      newElement.id = data.id;\n      newElement.className = 'vjs-custom-icon vjs-control';\n\n      newLink.innerHTML = \"<i class='icon \" + data.icon + \" line-height' aria-hidden='true'></i>\";\n      newElement.appendChild(newLink);\n      controlBar = document.getElementsByClassName('vjs-control-bar')[0];\n\n      insertBeforeNode = document.getElementsByClassName('vjs-fullscreen-control')[0];\n      controlBar.insertBefore(newElement, insertBeforeNode);\n\n      if (typeof onClickListener != \"undefined\") {\n        newElement.onclick = onClickListener; //Add the click listener\n      }\n\n      return newElement;\n    }\n\n    /**\n     * Handles click event for the \"Add subtitle button\"\n     * @return {[type]} [description]\n     */\n\n  }, {\n    key: 'onAddSubBtnClicked',\n    value: function onAddSubBtnClicked() {\n\n      var tempFileInput = $('<input/>').attr('type', 'file');\n      tempFileInput.change(this.onSubChanged.bind(this));\n\n      //Open the file dialog to select subtitle\n      tempFileInput.trigger('click');\n    }\n\n    /**\n     * Handles the event of a subtitle being changed or added\n     * @param {event} e  jQuery event object\n     */\n\n  }, {\n    key: 'onSubChanged',\n    value: function onSubChanged(e) {\n\n      var file = e.target.files[0],\n          fileUrl = window.URL.createObjectURL(file);\n\n      //Remove old tracks\n      var oldTracks = this.player.remoteTextTracks();\n      var i = oldTracks.length;\n      while (i--) {\n        this.player.removeRemoteTextTrack(oldTracks[i]);\n      }\n\n      //Add the track to the player\n      this.player.addRemoteTextTrack({ src: fileUrl, kind: 'captions', label: 'captions on' });\n\n      //enable the current subtitle\n      this.player.remoteTextTracks()[0].mode = 'showing';\n    }\n\n    /**\n     * Handles videojs player events and notifies peers about the event \n     * \n     */\n\n  }, {\n    key: 'onPlayerReady',\n    value: function onPlayerReady() {\n\n      //Palyer is ready\n      _Utilities.Utilities.log('Your player is ready!');\n\n      //Video seeking event handler\n      this.player.on(\"seeking\", function (e) {\n        this.videoSeeking = true;\n        _Utilities.Utilities.log(\"Video seeking: \" + this.player.currentTime());\n      }.bind(this));\n\n      //Video pause event handler\n      this.player.on('pause', function (e) {\n\n        var socketPayload = {\n          name: _Utilities.Utilities.session_identifier,\n          key: \"pause\",\n          value: true\n        };\n\n        if (this.notifyPeers) {\n\n          //Notify peers\n          _Utilities.Utilities.log(\"Video paused\", \"Sending socket message\");\n          if (_Utilities.Utilities.logging) {\n            console.log(socketPayload);\n          }\n\n          _Utilities.Utilities.websocket.send(JSON.stringify(socketPayload));\n        }\n\n        //Remove the notification lock, if present\n        this.notifyPeers = true;\n      }.bind(this));\n\n      //Video play event handler\n      this.player.on('play', function () {\n\n        if (this.videoSeeking) {\n          return;\n        }\n\n        var socketPayload = {\n          name: _Utilities.Utilities.session_identifier,\n          key: \"play\",\n          value: true\n        };\n\n        if (this.notifyPeers) {\n\n          //Notify peers\n          _Utilities.Utilities.log(\"Video played\", \"Sending socket message\");\n          if (_Utilities.Utilities.logging) {\n            console.log(socketPayload);\n          }\n          _Utilities.Utilities.websocket.send(JSON.stringify(socketPayload));\n        }\n\n        //Remove the notification lock, if present\n        this.notifyPeers = true;\n      }.bind(this));\n\n      //Video seeke happened event handler\n      this.player.on(\"seeked\", function (e) {\n\n        this.videoSeeking = false;\n        var seekedTo = this.player.currentTime();\n\n        if (seekedTo == this.lastSeekValue) {\n          return;\n        }\n\n        _Utilities.Utilities.log(\"Video seeked\");\n\n        var socketPayload = {\n          name: _Utilities.Utilities.session_identifier,\n          key: \"seek_value\",\n          value: { time: seekedTo, play: !this.player.paused() }\n        };\n\n        this.lastSeekValue = seekedTo;\n\n        if (this.notifyPeers) {\n\n          //Notify peers\n          _Utilities.Utilities.log(\"Sending seeked singal message\");\n          if (_Utilities.Utilities.logging) {\n            console.log(socketPayload);\n          }\n          _Utilities.Utilities.websocket.send(JSON.stringify(socketPayload));\n        }\n\n        //Remove the notification lock, if present\n        this.notifyPeers = true;\n      }.bind(this));\n    }\n  }]);\n\n  return VideoPlayer;\n}();\n\n//# sourceURL=webpack://GWatch/./src/js/VideoPlayer.js?");

/***/ }),

/***/ "jquery":
/*!********************!*\
  !*** external "$" ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = $;\n\n//# sourceURL=webpack://GWatch/external_%22$%22?");

/***/ }),

/***/ "video.js":
/*!**************************!*\
  !*** external "videojs" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = videojs;\n\n//# sourceURL=webpack://GWatch/external_%22videojs%22?");

/***/ })

/******/ });