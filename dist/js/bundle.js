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
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Gwatch.js
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * A controller class for the vidoe player and index page functionalities
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Anand Singh <@hack4mer> https://anand.today
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _VideoPlayer = __webpack_require__(1);

var _jquery = __webpack_require__(5);

var _jquery2 = _interopRequireDefault(_jquery);

var _Socket = __webpack_require__(6);

var _Utilities = __webpack_require__(3);

var _WebRTC = __webpack_require__(7);

var _app = __webpack_require__(8);

var _app2 = _interopRequireDefault(_app);

var _appSmallscreen = __webpack_require__(10);

var _appSmallscreen2 = _interopRequireDefault(_appSmallscreen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * GWatch constructor
 * @param {object} options configuration object for the GroupWat.ch player
 */
var GWatch = function () {
    function GWatch(options) {
        _classCallCheck(this, GWatch);

        //options and config
        this.config = {
            //configurable via the api
            container: options.container || false,
            src: options.src || false,
            videoCall: options.videoCall || false,
            devmode: options.devmode || false,
            socket_server: options.socket_server || false,
            localSource: options.localSource || false,
            disableChat: options.disableChat || false,
            disableVideo: options.disableVideo || false,
            onSocketConnected: options.onSocketConnected || function () {
                console.log("socket connected");
            },
            onSocketError: options.onSocketError || function () {
                _Utilities.Utilities.notifyError("socket connection failed");
            },

            //hardcoded configurations
            mainPlayerId: "GWatch_mainPlayer",
            mainPlayerSrcId: "GWatch_mainPlayerSrc",
            containerClass: "GWatch_container",
            chatBoxPaperClass: "GWatch_chatBoxPaper"
        };

        if (!this.config.container) {
            _Utilities.Utilities.notifyError("GWatch: Please specify the container option.");
            return;
        } else if (!this.config.socket_server) {
            _Utilities.Utilities.notifyError("GWatch: Please specify the socket_server option.");
            return;
        } else if (!this.config.localSource && !this.config.src) {
            _Utilities.Utilities.notifyError("GWatch: Please provide src or set localSource to true.");
            return;
        }

        this.containerEle = document.getElementById(options.container);
        this.containerEle.style.display = "flex";

        //A placeholder for an instance of the VideoPlayer
        this.video = null;

        //Creates the required dom elements
        this.initializeUIElements();
        this.uuid = _Utilities.Utilities.createUUID();

        //Generate UUID
        _Utilities.Utilities.uuid = this.uuid;

        //Setup UUID
        this.setUpRoomId();

        //Set utility options
        _Utilities.Utilities.config = this.config; // If the logs should appera in the console
        _Utilities.Utilities.logging = this.config.devmode; // If the logs should appera in the console
        _Utilities.Utilities.session_identifier = this.generateConnectionId(); //A unique identifier for the socket connection    
        _Utilities.Utilities.onSocketConnected = this.config.onSocketConnected;
        _Utilities.Utilities.onSocketError = this.config.onSocketError;
        _Utilities.Utilities.mSocket = new _Socket.Socket(this.config.socket_server); //Initialize the socket class    
        _Utilities.Utilities.websocket = _Utilities.Utilities.mSocket.websocket; //A global variable containing websocket connection object    


        //Initialize videocallui
        if (this.config.videoCall) {

            //Place holder for remote vidoe stream holders
            this.videoCallPanelRemoteStream = [];

            //Insert required elements in the dom
            this.initializeVideoCallUI();

            if (!_Utilities.Utilities.config.disableVideo) {
                //Initialzie the webrtc class and expose it as a public property of this class        
                this.webRTC = new _WebRTC.WebRTC();
            }
        } else {
            document.getElementById("GWatch_playerContainer").style.width = "100%";
        }

        //Enable panel resizer 
        this.enablePanelResizer();

        //Initialize the player if src is provided
        if (this.config.src) {
            this.changePlayerSource(this.config.src);
        }

        //If local file selector is requested
        if (this.config.localSource) {
            this.initializeLocalFileSelector();
        }
    }

    /**
     * Appends UUID in the URL and creates shareable url
     * Decides room id
     */


    _createClass(GWatch, [{
        key: 'setUpRoomId',
        value: function setUpRoomId() {
            if (window.location.hash.length > 0) {
                this.roomId = window.location.hash.substr(1);
            } else {
                this.roomId = this.uuid;
            }

            _Utilities.Utilities.roomId = this.roomId;
            _Utilities.Utilities.setCookie("roomId", this.roomId, 1);
            //window.location.hash = this.roomId;
        }

        /**
         * Creates required dom elements and appends in it
         * @return {[type]} [description]
         */

    }, {
        key: 'initializeUIElements',
        value: function initializeUIElements() {
            //Add the container class
            this.containerEle.classList.add(this.config.containerClass);

            //Setup the main video player
            //Create a conatainer
            this.mainVideoPlayerContainer = document.createElement("div");
            this.mainVideoPlayerContainer.setAttribute("id", "GWatch_playerContainer");

            //Create video tag
            this.mainVideoPlayer = document.createElement("video");
            this.mainVideoPlayer.setAttribute("controls", true);
            this.mainVideoPlayer.setAttribute("id", this.config.mainPlayerId);
            this.mainVideoPlayer.setAttribute("class", "video-js");
            this.mainVideoPlayer.setAttribute("preload", "auto");

            //Create source tag
            this.mainVideoPlayerSrc = document.createElement("source");
            this.mainVideoPlayerSrc.setAttribute("class", this.config.mainVideoPlayerSrcId);
            this.mainVideoPlayerSrc.setAttribute("src", "");
            this.mainVideoPlayerSrc.setAttribute("type", "video/mp4");

            //Create no js support tag
            this.mainVideoPlayerP = document.createElement("p");
            this.mainVideoPlayerP.setAttribute("class", "vjs-no-js");
            this.mainVideoPlayerP.innerHTML = 'To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="https://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>';

            //Add the video tag in the container
            this.mainVideoPlayer.appendChild(this.mainVideoPlayerSrc); // Add the source tag inside the video tag
            this.mainVideoPlayer.appendChild(this.mainVideoPlayerP); // Add the p tag inside the video tag
            this.mainVideoPlayerContainer.appendChild(this.mainVideoPlayer); //Add the video player in its container

            this.containerEle.appendChild(this.mainVideoPlayerContainer); //Add the video tag inside the container
        }
    }, {
        key: 'initializeVideoCallUI',
        value: function initializeVideoCallUI() {

            //Create panel container
            this.videoCallPanel = document.createElement("div");
            this.videoCallPanel.setAttribute("id", "GWatch_camContainer");
            this.videoCallPanel.classList.add("disableResizer");

            //Create panel resizer
            this.videoCallPanelResizer = document.createElement("div");
            this.videoCallPanelResizer.setAttribute("id", "GWatch_panResizer");

            //Create video broadcast button
            this.videoCallPanelStartBtn = document.createElement("button");
            this.videoCallPanelStartBtn.onclick = function () {
                this.webRTC.startVideoCall(true);
            }.bind(this);
            this.videoCallPanelStartBtn.innerHTML = "Start Video";

            //Container for local and remote video tags
            this.videoCallPanelVideos = document.createElement("div");
            this.videoCallPanelVideos.classList.add("GWatch_camContainer_videos");

            //Create video tag for localstream
            this.videoCallPanelLocalStream = this.createVideoStreamHolder({
                id: "localVideo",
                autoplay: ""
            });
            this.videoCallPanelLocalStream.muted = "muted";

            //Create video tag for first remote stream
            this.videoCallPanelRemoteStream[0] = this.createVideoStreamHolder({
                id: "remoteVideo",
                autoplay: ""
            });

            //Add all of the above to panel container
            if (!_Utilities.Utilities.config.disableVideo) {
                this.videoCallPanel.appendChild(this.videoCallPanelStartBtn);
            }

            if (!_Utilities.Utilities.config.disableVideo || !_Utilities.Utilities.config.disableChat) {
                this.videoCallPanel.appendChild(this.videoCallPanelResizer);
            }

            if (!_Utilities.Utilities.config.disableVideo) {

                this.videoCallPanelVideos.appendChild(this.videoCallPanelRemoteStream[0]);
                this.videoCallPanelVideos.appendChild(this.videoCallPanelLocalStream);
                this.videoCallPanel.appendChild(this.videoCallPanelVideos);

                //this.addTestVideoFrames();
            }

            if (!_Utilities.Utilities.config.disableChat) {
                this.makeChatUI();
                this.videoCallPanel.appendChild(this.chatContainer);
            }

            //Add the video panel to dom
            this.containerEle.appendChild(this.videoCallPanel);
        }
    }, {
        key: 'addTestVideoFrames',
        value: function addTestVideoFrames() {

            //only for development purpose, should be removed
            for (var i = 0; i < 10; i++) {
                this.videoCallPanelLocalStream_x = this.createVideoStreamHolder({
                    id: "localVideo" + Math.random() * 10,
                    autoplay: ""
                });
                this.videoCallPanelVideos.appendChild(this.videoCallPanelLocalStream_x);
            }
        }

        /**
         * Makes UI interface for the chat room
         */

    }, {
        key: 'makeChatUI',
        value: function makeChatUI() {

            //Chat box
            this.chatContainer = document.createElement("div");
            this.chatContainer.setAttribute("class", "GWatch_chat_container");

            this.chatBox = document.createElement("div");
            this.chatBox.setAttribute("class", "GWatch_chat_subcontainer");

            this.chatBoxInput = document.createElement("input");
            this.chatBoxInput.setAttribute("class", "GWatch_chatInput");
            this.chatBoxInput.setAttribute("type", "text");
            this.chatBoxInput.setAttribute("placeholder", "Type a message...");
            this.chatBoxInput.addEventListener("keyup", function (event) {
                if (event.key === "Enter") {
                    this.sendChat(this.chatBoxInput.value);
                }
            }.bind(this));

            this.chatBoxPaper = document.createElement("div");
            this.chatBoxPaper.setAttribute("class", this.config.chatBoxPaperClass);

            //Chat box 
            this.chatBox.appendChild(this.chatBoxPaper);
            this.chatBox.appendChild(this.chatBoxInput);
            this.chatContainer.appendChild(this.chatBox);
        }
    }, {
        key: 'initializeLocalFileSelector',
        value: function initializeLocalFileSelector() {

            this.localFileSelector = document.createElement("input");
            this.localFileSelector.setAttribute("type", "file");
            this.localFileSelector.setAttribute("class", "GWatch_localFileSeletor");

            this.localFileSelector.onchange = function (e) {
                this.onSrcSelected(e);
            }.bind(this);

            document.getElementById("GWatch_playerContainer").appendChild(this.localFileSelector);
        }
    }, {
        key: 'createVideoStreamHolder',
        value: function createVideoStreamHolder(attrs) {

            var videoHolder = document.createElement("video");

            videoHolder.classList.add("mirrored_video");

            for (var key in attrs) {
                videoHolder.setAttribute(key, attrs[key]);
            }

            return videoHolder;
        }
    }, {
        key: 'sendChat',
        value: function sendChat(message) {

            var chatMsg = document.createElement("p");
            chatMsg.innerHTML = message;
            chatMsg.style.color = "blue";
            chatMsg.style['text-align'] = "right";

            var chatHolder = document.getElementsByClassName(_Utilities.Utilities.config.chatBoxPaperClass)[0];
            chatHolder.appendChild(chatMsg);
            chatHolder.scrollTop = chatHolder.scrollHeight;

            this.chatBoxInput.value = "";

            //Send chat
            var socketPayload = {
                roomId: _Utilities.Utilities.roomId,
                name: _Utilities.Utilities.session_identifier,
                key: "chat",
                value: message
            };

            console.log(socketPayload);

            _Utilities.Utilities.websocket.send(JSON.stringify(socketPayload));
        }

        /**
         * Enable player resizer
         */

    }, {
        key: 'enablePanelResizer',
        value: function enablePanelResizer() {

            this.isResizing = false, this.lastDownX = 0;

            var container = (0, _jquery2.default)('#' + _Utilities.Utilities.config.container),
                left = (0, _jquery2.default)('#GWatch_playerContainer', '#' + _Utilities.Utilities.config.container),
                right = (0, _jquery2.default)('#GWatch_camContainer', '#' + _Utilities.Utilities.config.container),
                handle = (0, _jquery2.default)('#GWatch_panResizer', '#' + _Utilities.Utilities.config.container);

            handle.on('mousedown', function (e) {
                this.isResizing = true;
                this.lastDownX = e.clientX;
            }.bind(this));

            (0, _jquery2.default)(document).on('mousemove', function (e) {

                // we don't want to do anything if we aren't resizing.
                if (!this.isResizing) return;

                var offsetRight = e.clientX;
                var offseLeft = container.width() - offsetRight;

                if (offsetRight > container.width()) {
                    return;
                }

                left.css('width', offsetRight);
                right.css('width', offseLeft);
            }.bind(this)).on('mouseup', function (e) {
                // stop resizing
                this.isResizing = false;
            }.bind(this));
        }

        /**
         * Event handler for the change in video selector input file 
         */

    }, {
        key: 'onSrcSelected',
        value: function onSrcSelected(e) {

            var file = e.target.files[0],
                fileUrl = window.URL.createObjectURL(file);

            _Utilities.Utilities.log("New source file selected");

            //Configure the player to use newly selected source
            this.changePlayerSource(fileUrl);
        }

        /**
        * Changes video source and configures the player to use it
        * @param  {string} newSrc the new video source to be applied
        */

    }, {
        key: 'changePlayerSource',
        value: function changePlayerSource(newSrc) {

            _Utilities.Utilities.log("Changing player's source");

            //Change src element
            this.containerEle.getElementsByClassName(this.config.mainVideoPlayerSrcId)[0].setAttribute("src", newSrc);

            if (typeof _Utilities.Utilities.player == "undefined") {

                //Initialize video player
                _Utilities.Utilities.video = new _VideoPlayer.VideoPlayer();
                _Utilities.Utilities.player = _Utilities.Utilities.video.player;
            } else {

                //Video player already initialized
                //Change video player source
                _Utilities.Utilities.player.src({ type: 'video/mp4', src: newSrc });
                _Utilities.Utilities.player.load();
            }
        }

        /**
        * Generates a random string to use as an identifier for the socket connection
        * @return {[type]} [description]
        */

    }, {
        key: 'generateConnectionId',
        value: function generateConnectionId() {
            var date = new Date();
            return btoa(unescape(encodeURIComponent(date.getTime() + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)))).slice(0, -2);
        }
    }]);

    return GWatch;
}();

module.exports = GWatch;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.VideoPlayer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * VideoPlayer
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * A controller class for the VideoJS player events
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * All the socket notifications are sent by this class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Ananad <@hack4mer> https://anand.today
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _video = __webpack_require__(2);

var _video2 = _interopRequireDefault(_video);

var _Utilities = __webpack_require__(3);

var _srtWebvtt = __webpack_require__(4);

var _srtWebvtt2 = _interopRequireDefault(_srtWebvtt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Constructor for the videoJS player controller
 */
var VideoPlayer = exports.VideoPlayer = function () {
	function VideoPlayer() {
		var _this = this;

		_classCallCheck(this, VideoPlayer);

		var options = {
			controlBar: {
				fullscreenToggle: false,
				allowFullscreen: false
			}
		};

		this.fullscreenmode = false;

		this.lastSeekValue = 0;
		this.videoSeeking = 0;

		//Decides wether to send event notification to others through the socket   
		this.notifyPeers = true;

		//Initialize the videojs player
		this.player = (0, _video2.default)(_Utilities.Utilities.config.mainPlayerId, options, this.onPlayerReady.bind(this));
		this.containerEle = document.getElementById(_Utilities.Utilities.config.container);

		//Addig the modaldialog class prevents fullscreen on double click
		this.containerEle.getElementsByClassName("vjs-tech")[0].classList.add("vjs-modal-dialog");

		//Adds all the custom control buttons
		this.addAllControlBtns();

		//Fullscreen change event		
		//If videocalls are going on
		if (_Utilities.Utilities.config.videoCall) {

			["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "msfullscreenchange"].forEach(function (eventType) {
				return document.addEventListener(eventType, _this.fullScreenChanged.bind(_this), false);
			});
		}
	}

	/**
  * Adds all custom btns 
  */


	_createClass(VideoPlayer, [{
		key: 'addAllControlBtns',
		value: function addAllControlBtns() {

			//Add subtitle button
			this.subtitleBtn = this.addNewButton({
				"id": "addSubsBtn",
				"icon": "icon-speech",
				"title": "Add subtitle"
			}, this.onAddSubBtnClicked.bind(this));

			//Add subtitle button
			this.fullScreenBtn = this.addNewButton({
				"id": "fullScreenToogleBtn",
				"icon": "icon-size-fullscreen",
				"title": "Toggle fullscreen mode"
			}, this.toggleFullScreen.bind(this));
		}

		/**
   * Handles ecape click in fullscreen mode
   * @param  event e event object
   */

	}, {
		key: 'fullScreenChanged',
		value: function fullScreenChanged(e) {

			var isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;

			if (!isFullScreen) {
				this.switchedOffFullscreen();
			}
		}

		/**
  * Toggles the container to fullscreen
  */

	}, {
		key: 'toggleFullScreen',
		value: function toggleFullScreen() {

			if (this.fullscreenmode) {

				this.exitFullscreenMode();
			} else {

				this.enterFullScreenMode();
			}
		}
	}, {
		key: 'exitFullscreenMode',
		value: function exitFullscreenMode() {
			//Exit fullscreen
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			}

			this.switchedOffFullscreen();
		}
	}, {
		key: 'enterFullScreenMode',
		value: function enterFullScreenMode() {

			//Enter fullscreen
			if (this.containerEle.requestFullscreen) {
				this.containerEle.requestFullscreen();
				this.switchedOnFullscreen();
			} else if (this.containerEle.mozRequestFullScreen) {
				this.containerEle.mozRequestFullScreen();
				this.switchedOnFullscreen();
			} else if (this.containerEle.webkitRequestFullscreen) {
				this.containerEle.webkitRequestFullscreen();
				this.switchedOnFullscreen();
			}
		}
	}, {
		key: 'hideLocalFileSelector',
		value: function hideLocalFileSelector() {
			document.getElementsByClassName("GWatch_localFileSeletor")[0].style.display = "none";
		}
	}, {
		key: 'showLocalFileSelector',
		value: function showLocalFileSelector() {
			document.getElementsByClassName("GWatch_localFileSeletor")[0].style.display = "block";
		}

		/**
  * Performs post-nonfullscreenmode task
  */

	}, {
		key: 'switchedOffFullscreen',
		value: function switchedOffFullscreen() {
			this.fullscreenmode = false;
			this.containerEle.classList.remove("fullscreen_vidjs");

			if (_Utilities.Utilities.config.localSource) {
				this.showLocalFileSelector();
			}

			if (_Utilities.Utilities.config.videoCall) {

				//Resize to default sizes on screen changes
				document.getElementById("GWatch_playerContainer").style.width = "100%";
				var camContainer = document.getElementById("GWatch_camContainer");
				camContainer.style.width = "20%";
				camContainer.classList.add("disableResizer");
			}
		}

		/**
  * Performs post-fullscreenmode tasks
  */

	}, {
		key: 'switchedOnFullscreen',
		value: function switchedOnFullscreen() {
			this.fullscreenmode = true;
			this.containerEle.classList.add("fullscreen_vidjs");

			if (_Utilities.Utilities.config.localSource) {
				this.hideLocalFileSelector();
			}

			if (_Utilities.Utilities.config.videoCall) {

				//Resize to default sizes on screen changes		
				document.getElementById("GWatch_playerContainer").style.width = "80%";
				var camContainer = document.getElementById("GWatch_camContainer");
				camContainer.style.width = "20%";
				camContainer.classList.remove("disableResizer");
			}
		}

		/**
  * Adds new button to the player
  * @param {object} data an object with valid keys : icon,id,title
  * @param {function} onClickListener A click listener for the added button
  */

	}, {
		key: 'addNewButton',
		value: function addNewButton(data, onClickListener) {

			var myPlayer = this.player,
			    controlBar,
			    insertBeforeNode,
			    newElement = document.createElement('div'),
			    newLink = document.createElement('a');

			newElement.id = data.id;
			newElement.className = 'vjs-custom-icon vjs-control';

			newLink.innerHTML = "<i title='" + data.title + "' class='icon " + data.icon + " line-height' aria-hidden='true'></i>";
			newElement.appendChild(newLink);
			controlBar = this.containerEle.getElementsByClassName('vjs-control-bar')[0];

			insertBeforeNode = this.containerEle.getElementsByClassName('vjs-fullscreen-control')[0];
			controlBar.insertBefore(newElement, insertBeforeNode);

			if (typeof onClickListener != "undefined") {
				newElement.onclick = onClickListener; //Add the click listener
			}

			return newElement;
		}

		/**
   * Handles click event for the "Add subtitle button"
   * @return {[type]} [description]
   */

	}, {
		key: 'onAddSubBtnClicked',
		value: function onAddSubBtnClicked() {

			var tempFileInput = $('<input/>').attr('type', 'file').attr('accept', '.vtt,.srt');
			tempFileInput.change(this.onSubChanged.bind(this));

			//Open the file dialog to select subtitle
			tempFileInput.trigger('click');
		}

		/**
   * Handles the event of a subtitle being changed or added
   * @param {event} e  jQuery event object
   */

	}, {
		key: 'onSubChanged',
		value: function onSubChanged(e) {

			var file = e.target.files[0],
			    fileExt = file.name.slice(-3),
			    fileUrl;

			//Convert to .vtt if the selected file is .srt
			if (fileExt == "srt") {

				//a .srt file is selected
				//covert it and enable it
				this.setSrtSubtitle(file);
			} else if (fileExt == "vtt") {

				//.vtt is selected, no coversion required
				fileUrl = window.URL.createObjectURL(file), this.setSubtitle(fileUrl);
			} else {

				_Utilities.Utilities.notifyError("Only .srt and .vtt files are supported as subtitles");
			}
		}

		/**
   * Sets a given ur as the subtitle of the playing video, removes old ones
   * @param {string} url remote url to be used as source for the subtitle
   */

	}, {
		key: 'setSubtitle',
		value: function setSubtitle(fileUrl) {
			//Remove old tracks
			var oldTracks = this.player.remoteTextTracks();
			var i = oldTracks.length;
			while (i--) {
				this.player.removeRemoteTextTrack(oldTracks[i]);
			}

			//Add the track to the player
			this.player.addRemoteTextTrack({ src: fileUrl, kind: 'captions', label: 'captions on' });

			//enable the current subtitle
			this.player.remoteTextTracks()[0].mode = 'showing';
		}

		/**
   * converts a .srt subtitle file to .vtt file and activates it 
   * @param  {file} file selected subtitle file
   */

	}, {
		key: 'setSrtSubtitle',
		value: function setSrtSubtitle(file) {
			var _ = this;
			var vttConverter = new _srtWebvtt2.default(file);

			vttConverter.getURL().then(function (url) {

				//.vtt generated      
				//Enable the subtitles
				_.setSubtitle(url);
			}).catch(function (err) {

				//Error occured during conversion
				_Utilities.Utilities.notifyError("Selected .srt file seems to be invalid");
				console.error(err);
			});
		}

		/**
   * Handles videojs player events and notifies peers about the event 
   * 
   */

	}, {
		key: 'onPlayerReady',
		value: function onPlayerReady() {

			//Palyer is ready
			_Utilities.Utilities.log('Your player is ready!');

			//Video seeking event handler
			this.player.on("seeking", function (e) {
				this.videoSeeking = true;
				_Utilities.Utilities.log("Video seeking: " + this.player.currentTime());
			}.bind(this));

			//Video pause event handler
			this.player.on('pause', function (e) {

				var socketPayload = {
					roomId: _Utilities.Utilities.roomId,
					name: _Utilities.Utilities.session_identifier,
					key: "pause",
					value: true
				};

				if (this.notifyPeers) {

					//Notify peers
					_Utilities.Utilities.log("Video paused", "Sending socket message");
					if (_Utilities.Utilities.logging) {
						console.log(socketPayload);
					}

					_Utilities.Utilities.websocket.send(JSON.stringify(socketPayload));
				}

				//Remove the notification lock, if present
				this.notifyPeers = true;
			}.bind(this));

			//Video play event handler
			this.player.on('play', function () {

				if (this.videoSeeking) {
					return;
				}

				var socketPayload = {
					roomId: _Utilities.Utilities.roomId,
					name: _Utilities.Utilities.session_identifier,
					key: "play",
					value: true
				};

				if (this.notifyPeers) {

					//Notify peers
					_Utilities.Utilities.log("Video played", "Sending socket message");
					if (_Utilities.Utilities.logging) {
						console.log(socketPayload);
					}
					_Utilities.Utilities.websocket.send(JSON.stringify(socketPayload));
				}

				//Remove the notification lock, if present
				this.notifyPeers = true;
			}.bind(this));

			//Video seeke happened event handler
			this.player.on("seeked", function (e) {

				this.videoSeeking = false;
				var seekedTo = this.player.currentTime();

				if (seekedTo == this.lastSeekValue) {
					return;
				}

				_Utilities.Utilities.log("Video seeked");

				var socketPayload = {
					roomId: _Utilities.Utilities.roomId,
					name: _Utilities.Utilities.session_identifier,
					key: "seek_value",
					value: { time: seekedTo, play: !this.player.paused() }
				};

				this.lastSeekValue = seekedTo;

				if (this.notifyPeers) {

					//Notify peers
					_Utilities.Utilities.log("Sending seeked singal message");
					if (_Utilities.Utilities.logging) {
						console.log(socketPayload);
					}
					_Utilities.Utilities.websocket.send(JSON.stringify(socketPayload));
				}

				//Remove the notification lock, if present
				this.notifyPeers = true;
			}.bind(this));
		}
	}]);

	return VideoPlayer;
}();

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = videojs;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Utility functions and global variables for the project
 */

var Utilities = exports.Utilities = function () {
    function Utilities() {
        _classCallCheck(this, Utilities);

        this.logging = false;
    }

    /**
     * Simple method to log debug messages with a predefined tag 
        */


    _createClass(Utilities, null, [{
        key: "log",
        value: function log() {

            if (!this.logging) {
                return;
            } //Disabled when not in devmode

            console.log("GWatch: ", [].slice.call(arguments).join(","));
        }

        /**
         * Notifies user about an error that occured
         * @return {[type]} [description]
         */

    }, {
        key: "notifyError",
        value: function notifyError(message) {
            console.error(message + ", See https://groupwat.ch/");
        }

        // Taken from http://stackoverflow.com/a/105074/515584
        // Strictly speaking, it's not a real UUID, but it gets the job done here

    }, {
        key: "createUUID",
        value: function createUUID() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            }

            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }
    }, {
        key: "setCookie",
        value: function setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }
    }, {
        key: "getCookie",
        value: function getCookie(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }
    }]);

    return Utilities;
}();

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
class WebVTTConverter {
  constructor(resource) {
    this.resource = resource;
  }

  blobToBuffer() {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('loadend', (event) => {
        const buf = event.target.result;
        resolve(new Uint8Array(buf));
      });
      reader.addEventListener('error', () => reject('Error while reading the Blob object'));
      reader.readAsArrayBuffer(this.resource);
    });
  }
  /**
   * @param {*} blob
   * @param {*} success
   * @param {*} fail
   */
  static blobToString(blob, success, fail) {
    const reader = new FileReader();
    reader.addEventListener('loadend', (event) => {
      const text = event.target.result;
      success(text);
    });
    reader.addEventListener('error', () => fail());
    reader.readAsText(blob);
  }
  /**
   * @param {*} utf8str
   */
  static toVTT(utf8str) {
    return utf8str
      .replace(/\{\\([ibu])\}/g, '</$1>')
      .replace(/\{\\([ibu])1\}/g, '<$1>')
      .replace(/\{([ibu])\}/g, '<$1>')
      .replace(/\{\/([ibu])\}/g, '</$1>')
      .replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2')
      .concat('\r\n\r\n');
  }
  /**
   * @param {*} str
   */
  static toTypedArray(str) {
    const result = [];
    str.split('').forEach((each) => {
      result.push(parseInt(each.charCodeAt(), 16));
    });
    return Uint8Array.from(result);
  }

  getURL() {
    return new Promise((resolve, reject) => {
      if (!(this.resource instanceof Blob)) return reject('Expecting resource to be a Blob but something else found.');
      if (!(FileReader)) return reject('No FileReader constructor found');
      if (!TextDecoder) return reject('No TextDecoder constructor found');
      return WebVTTConverter.blobToString(
        this.resource,
        (decoded) => {
          const vttString = 'WEBVTT FILE\r\n\r\n';
          const text = vttString.concat(WebVTTConverter.toVTT(decoded));
          const blob = new Blob([text], { type: 'text/vtt' });
          this.objectURL = URL.createObjectURL(blob);
          return resolve(this.objectURL);
        },
        () => {
          this.blobToBuffer()
            .then((buffer) => {
              const utf8str = new TextDecoder('utf-8').decode(buffer);
              const vttString = 'WEBVTT FILE\r\n\r\n';
              const text = vttString.concat(WebVTTConverter.toVTT(utf8str));
              const blob = new Blob([text], { type: 'text/vtt' });
              this.objectURL = URL.createObjectURL(blob);
              return resolve(this.objectURL);
            });
        },
      );
    });
  }

  release() {
    URL.createObjectURL(this.objectURL);
  }
}

window.WebVTTConverter = WebVTTConverter;

/* harmony default export */ __webpack_exports__["default"] = (WebVTTConverter);


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = $;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Socket = undefined;

var _jquery = __webpack_require__(5);

var _jquery2 = _interopRequireDefault(_jquery);

var _Utilities = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * socket constructor
 * @param  {string} SOCKET_SERVER Hostname of the socket server
 */
/**
 * Socket.js
 * A controller for the WebSocket events and communications for the video player 
 * @author Anand Singh <@hack4mer> https://anand.today
 */

var Socket = exports.Socket = function Socket(socket_server) {

  this.wsUri = socket_server;
  this.websocket = new WebSocket(this.wsUri);

  this.websocket.onopen = _Utilities.Utilities.onSocketConnected.bind(this);
  this.websocket.onmessage = this.onMessage;
  this.websocket.onerror = _Utilities.Utilities.onSocketError.bind(this);
  this.websocket.onclose = _Utilities.Utilities.onSocketError.bind(this);
};

Socket.prototype.onMessage = function (ev) {

  var response = JSON.parse(ev.data); //Server sends Json string

  if (response.key == "chat") {

    console.log(response);

    var chatMsg = document.createElement("p");
    chatMsg.innerHTML = response.value;
    chatMsg.style.color = "red";
    chatMsg.style['text-align'] = "left";

    var chatHolder = document.getElementsByClassName(_Utilities.Utilities.config.chatBoxPaperClass)[0];
    chatHolder.appendChild(chatMsg);
    chatHolder.scrollTop = chatHolder.scrollHeight;
    return;
  }

  if (!_Utilities.Utilities.video) {
    return;
  } //Video has not been initialized yet


  //Do not notify others about this player event since it was triggered by someone else
  _Utilities.Utilities.video.notifyPeers = false;

  _Utilities.Utilities.log("Socket message received:", _Utilities.Utilities.video.notifyPeers);
  if (_Utilities.Utilities.logging) {
    console.log(response);
  }

  console.log(response);

  if (response.key == "seek_value") {

    _Utilities.Utilities.player.currentTime(response.value.time); //Seek the video

    if (response.value.play) {
      _Utilities.Utilities.player.play(); //Play if the peers video is playing
    }
  } else if (response.key == "pause" && !_Utilities.Utilities.player.paused()) {

    //Pause the video as requested by the peer
    _Utilities.Utilities.player.pause();
  } else if (response.key == "play" && _Utilities.Utilities.player.paused()) {

    //Play the video as requested by the peer
    _Utilities.Utilities.player.play();
  } else {

    //Remove the notification lock
    _Utilities.Utilities.video.notifyPeers = true;
  }
};

/**
 * Socket connection error handler
 * @param  {event} ev event object 
 */
Socket.prototype.onError = _Utilities.Utilities.onSocketError;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.WebRTC = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * WebRTC.js
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Controller class for the WebRTC audio/video/file transmission
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _Utilities = __webpack_require__(3);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebRTC = exports.WebRTC = function () {
	function WebRTC() {
		_classCallCheck(this, WebRTC);

		this.peerConnectionConfig = {
			'iceServers': [{ 'urls': 'stun:stun.stunprotocol.org:3478' }, { 'urls': 'stun:stun.l.google.com:19302' }]
		};

		this.uuid = _Utilities.Utilities.uuid;

		this.localVideo = document.getElementById('localVideo');
		this.remoteVideo = document.getElementById('remoteVideo');

		this.serverConnection = _Utilities.Utilities.websocket;
		this.serverConnection.onmessage = this.gotMessageFromServer.bind(this);

		this.constraints = {
			video: true,
			audio: true
		};

		if (navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices.getUserMedia(this.constraints).then(this.getUserMediaSuccess.bind(this)).catch(this.errorHandler);
		} else {
			alert('Your browser does not support getUserMedia API');
		}
	}

	_createClass(WebRTC, [{
		key: 'getUserMediaSuccess',
		value: function getUserMediaSuccess(stream) {
			this.localStream = stream;
			this.localVideo.srcObject = stream;
		}
	}, {
		key: 'startVideoCall',
		value: function startVideoCall(isCaller) {
			this.peerConnection = new RTCPeerConnection(this.peerConnectionConfig);
			this.peerConnection.onicecandidate = this.gotIceCandidate.bind(this);
			this.peerConnection.ontrack = this.gotRemoteStream.bind(this);
			this.peerConnection.addStream(this.localStream);

			if (isCaller) {
				this.peerConnection.createOffer().then(this.createdDescription.bind(this)).catch(this.errorHandler);
			}
		}
	}, {
		key: 'gotMessageFromServer',
		value: function gotMessageFromServer(message) {

			//Call the super method
			_Utilities.Utilities.mSocket.onMessage(message);

			var signal = JSON.parse(message.data);

			if (!this.peerConnection) this.startVideoCall(false);

			if (signal.sdp) {
				this.peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(function () {
					// Only create answers in response to offers
					if (signal.sdp.type == 'offer') {
						this.peerConnection.createAnswer().then(this.createdDescription.bind(this)).catch(this.errorHandler);
					}
				}.bind(this)).catch(this.errorHandler);
			} else if (signal.ice) {
				console.log(message);
				console.log("Adding : ", signal.ice.candidate);
				this.peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice)).catch(this.errorHandler);
			}
		}
	}, {
		key: 'gotIceCandidate',
		value: function gotIceCandidate(event) {
			if (event.candidate != null) {
				this.serverConnection.send(JSON.stringify({ 'roomId': _Utilities.Utilities.roomId, 'ice': event.candidate, 'uuid': this.uuid }));
			}
		}
	}, {
		key: 'createdDescription',
		value: function createdDescription(description) {
			console.log('got description');

			this.peerConnection.setLocalDescription(description).then(function () {
				this.serverConnection.send(JSON.stringify({ 'roomId': _Utilities.Utilities.roomId, 'sdp': this.peerConnection.localDescription, 'uuid': this.uuid }));
			}.bind(this)).catch(this.errorHandler);
		}
	}, {
		key: 'gotRemoteStream',
		value: function gotRemoteStream(event) {
			console.log('got remote stream');
			this.remoteVideo.srcObject = event.streams[0];
			this.remoteVideo.style.height = "auto";
		}
	}, {
		key: 'errorHandler',
		value: function errorHandler(error) {
			console.error(error);
		}

		/**
   * Pause the audio and video streaming
   */

	}, {
		key: 'pauseVideoCall',
		value: function pauseVideoCall() {
			this.pauseVideo();
			this.pauseAudio();
		}

		/**
   * Pause just the video 
   */

	}, {
		key: 'pauseVideo',
		value: function pauseVideo() {
			this.localStream.getVideoTracks()[0].enabled = false;
		}

		/**
   * Pause just the audio streaming
   */

	}, {
		key: 'pauseAudio',
		value: function pauseAudio() {
			this.localStream.getAudioTracks()[0].enabled = false;
		}

		/**
   * Resume audio and video streaming
   */

	}, {
		key: 'resumeVideoCall',
		value: function resumeVideoCall() {
			this.resumeVideo();
			this.resumeAudio();
		}

		/**
   * Resume just the video streaming
   * @return {[type]} [description]
   */

	}, {
		key: 'resumeVideo',
		value: function resumeVideo() {
			this.localStream.getVideoTracks()[0].enabled = true;
		}

		/**
   * Resume the audio streaming
   */

	}, {
		key: 'resumeAudio',
		value: function resumeAudio() {
			this.localStream.getAudioTracks()[0].enabled = true;
		}
	}]);

	return WebRTC;
}();

/***/ }),
/* 8 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 9 */,
/* 10 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);