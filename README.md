# GroupWat.ch
Make your own video room to watch videos remotely with all your friends
### Demo
Here's is a demo : <https://groupwat.ch/examples/advanced.html>

Please note that many people might be using the demo page (the demo socket server) in real-time. Therefore when they pause, play or seek a video, the same reflects on your end too.

### Features

- Play videos  in sync with people from anywhere on the globe
- Video call, voice call, chat room
- Support .srt and .vtt subtitles, can be added from your local disk
- Play your local video files [No downloding or streaming]
- [Video.js](https://github.com/videojs/video.js) video player, highly customizable and open-source 
- Uses WebSocket server  not WebRTC, hence easy to deploy without HTTPS
- Handy to use as a standalone in your web-browser

## QuickStart
Include CSS

    <link href="https://vjs.zencdn.net/7.1.0/video-js.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.4.1/css/simple-line-icons.css">
    <link rel="stylesheet" href="https://groupwat.ch/build/styles.css">`


Include JS

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="https://unpkg.com/video.js/dist/video.js"></script>
    <script src="https://groupwat.ch/build/bundle.js"></script>


Initialize the plugin

    <div id="video_container"></div>  
    <script type="text/javascript">

    var config = {
      container : 'video_container',
      src : 'https://vjs.zencdn.net/v/oceans.mp4',
      socket_server : "wss://YOUR_SOCKET_SERVER",
      videoCall:true
    }

    var mGWatch = new GWatch(config);
    </script>

## Installation
Follow these steps to run groupwat.ch on your server

- Step 1 : Clone the repo or [Download Zip](https://github.com/hack4mer/groupwat.ch/archive/master.zip) archive
- Setup 2: Setup the socket server
    - Open terminal and `cd` to the project directory  
    - Run `composer install` to install socket server depenedencies
    -  Start the websocket server by running `php -q socket_server/server.php`
- Step 3: Open any .html file from the `examples` directory
- Step 4: Change the `socket_server` value from 'wss://s1.site4m.com/wss2/' (it is the demo server) to :
    - `ws://youdomain.com:12345` : Unsecure protocol
    - `wss://youdomain.com/wss2/` : Secure protocol,  extra setup is required for "wss" to work, please Google this if you intend to use wss.

NOTE:  For video call and chat feature to work, webserver should be running on secure `wss` protocol. 

That's it, now visit the example page and if all went well, you will  see this in the console: 
`Socket connected!` 

If your socket connection fails that means , either:
- Socket is not running, run it by following step 2
- or, you are connecting to the socket through "ws" protocol from "https" version of your website which requires "wss";  Try over http.
- or,  your firewall is blocking the port on which the websocket is running (12345 by default)

 
### Configuration
Following are configuration options available for the `GWatch` API

| Option        				| Description       															| Value  |
| ----------------------------- | ----------------------------------------------------------------------------- | -------------- |
| container 	     			| ID of the div in which the GWatch UI should load								|	 required |
| socket_server      			| Complete URL of the socket server 											|	 required |
| src  			    			| URL of the video file to play 												|	 required or `localSource` should be `true`  |
| localSource  			    	| Show a local-disk video file selector											|	 Default: false |
| videoCall                     | Enable video, voice  & chat features                                          |    Default: false |
| disableVideo                  | When true: Disables video & voice features, allows chat only                  |    Default: false |
| disableChat  			        | When true: Disables the chat feature, allows video & voice only			    |	 Default: false |
| devmode      					| Devevelopment mode, informative console logs are disabled is set to false   	|    Default: false |
| onSocketConnected 			| Function to be fired when socket connection is succesful      				|    `function(){ console.log("socket connected");` |
| onSocketError 				| Function to be fired when socket connection fails      						|    `function(){ console.error("socket connection failed");}` |





License
----

MIT