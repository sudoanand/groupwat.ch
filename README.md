# GroupWat.ch
Make your own video room to watch videos remotely with all your friends
### Demo
Here's a demo : <https://groupwat.ch/example.html>

Please note that many people might be using the demo page (the demo socket server) in real-time. Therefore when they pause, play or seek a video, the same reflects on your end too.

### Features

- Play videos  in sync with people from anywhere on the globe
- Support .srt and .vtt subtitles, can be added from your local disk
- Play your local video files [No downloding or streaming]
- [Video.js](https://github.com/videojs/video.js) video player, highly customizable and open-source 
- Uses WebSocket server  not WebRTC, hence easy to deploy without HTTPS
- Handy to use as a standalone in your web-browser

## Installation
Follow these steps to run groupwat.ch on your server (or localhost), it needs `php-cli` installed.

- Step 1 : Clone the repo or [Download Zip](https://github.com/hack4mer/groupwat.ch/archive/master.zip) archive
- Setup 2: Setup the socket server
    - cd to the project directory  
    -  Start the websocket server by running `php -q socket_server/server.php`
    - Edit the "example.html" file and in the config object at the bottom, change the     `socket_server` value from 'wss://s1.site4m.com/wss2/' (it is the demo server) to :
        - `ws://youdomain.com:12345` : For HTTP protocol
        - `wss://youdomain.com/wss2/` : For HTTPS protocol  (extra setup is required for "wss" to work, please Google this if you intend to use wss. For personal use, ws is good!)

NOTE: replace yourdomain.com with your server's hostname and `12345` with the port on which the socket server is running; port of the socket can be configured in the "socket_server/server.php" file.

That's it, now visit the example.html page and if all went well, you will see: 
`Socket connected!` 

If your socket connection fails that means , either:
- socket is not running, run it by following step 2
- or, you are connecting to the socket through "ws" protocol from "https" version of your website which requires "wss"; Try with http.
- or,  your firewall is blocking the port on which the websocket is running (12345 by default)

 
### Configuration
Following are configuration options available for the `GWatch` API
Option  			| Option 															| Default value
------------------- | --------------------------------------------------------------------- | -------------
socket_server       | Complete URL of the socket server   									| 'ws://'+window.location.hostname+':12345'
devmode             | Devevelopment mode, informative console logs are disabled is set to false | false
onSocketConnected   | Function to be fired when socket connection is succesful 				| function(){ console.log("socket connected");}
onSocketError       | Function to be fired when socket connection fails 					| function(){ console.error("socket connection failed");}
videoId             |  ID of the video element 												| my-video
videoSelector       | ID of the input box for selecting the video file 						| video-selector
videoSrcElement     | ID of the "source" tag inside the "video" tag 						| my-video-src

### Test

Colons can be used to align columns.

| Option        | Option        | Default value  |
| ------------- | ------------- | ----- |
| socket_server      	| Complete URL of the socket server 											|	 `'ws://'+window.location.hostname+':12345'` |
| devmode      			| Devevelopment mode, informative console logs are disabled is set to false   	|   false |
| onSocketConnected 	| Function to be fired when socket connection is succesful      				|    `function(){ console.log("socket connected");` |
| onSocketError 		| Function to be fired when socket connection fails      						|    `function(){ console.error("socket connection failed");}` |
| videoId 				| ID of the video element      													|    my-video |
| videoSelector 		| ID of the input box for selecting the video file      						|    video-selector |
| videoSrcElement		| ID of the "source" tag inside the "video" tag      							|    my-video-src |



License
----

MIT