# GroupWat.ch
Make your own video room to watch videos remotely with all your friends

### Demo
Here's is a demo : <https://groupwat.ch/examples/advanced.html>

### Features

- Play videos  in sync with people from anywhere on the globe
- Video call, voice call, chat room
- Support .srt and .vtt subtitles, can be added from your local disk
- Play your local video files [No downloding or streaming]
- [Video.js](https://github.com/videojs/video.js) video player, highly customizable and open-source 
- Uses WebSocket server  not WebRTC, hence easy to deploy without HTTPS
- Handy to use as a standalone in your web-browser

**Note :  current version on Groupwat.ch supports two peers (people) only, we are adding multiple peer support very soon**
## QuickStart
#### Include CSS

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.4.1/css/simple-line-icons.css">
    <link href="https://unpkg.com/video.js@7.1.0/dist/video-js.css" rel="stylesheet">
    <link rel="stylesheet" href="https://unpkg.com/groupwat.ch/dist/css/styles.min.css">


#### Include JS

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="https://unpkg.com/video.js@7.1.0/dist/video.js"></script>
    <script src="https://unpkg.com/groupwat.ch"></script>


#### Initialize the plugin
Replace `YOUR_CHANNEL_ID` and `YOUR_ROOM_ID` with your own unique identifiers. 

Read [WebSocket.in docs](https://www.websocket.in/docs)  to get help with choosing `YOUR_CHANNEL_ID` and `YOUR_ROOM_id`.



    <div id="video_container"></div>  
    <script type="text/javascript">

    var config = {
      socket_server:'wss://connect.websocket.in/YOUR_CHANNEL_ID?room_id=YOUR_ROOM_ID',
      container : 'video_container',
      src : 'https://vjs.zencdn.net/v/oceans.mp4',
      socket_server : "wss://YOUR_SOCKET_SERVER",
      videoCall:true
    }

    var mGWatch = new GWatch(config);
    </script>

This example code usage free WebSocket server from  [WebSocket.in](https://www.websocket.in/)  for WebRTC signaling, you may use your own WebSocket server if you wish to.
 
 Codepen : [https://codepen.io/hack4mer/full/dgVJpN](https://codepen.io/hack4mer/full/dgVJpN)
## Configuration
Following are configuration options available for the `GWatch` API
Note: This doc table might be outdated, see [GWatch.js source](https://github.com/hack4mer/groupwat.ch/blob/master/src/js/GWatch.js#L26) for updated configurations and [Event.js](https://github.com/hack4mer/groupwat.ch/blob/master/src/js/Events.js) for all supported events.

| Option                | Description                                     | Value  |
| ----------------------------- | ----------------------------------------------------------------------------- | -------------- |
| container             | ID of the div in which the GWatch UI should load                |  required |
| socket_server           | Complete URL of the socket server                       |  required |
| src                 | URL of the video file to play                         |  required, if `localSource != true`  |
| localSource             | Show a local-disk video file selector                     |  Default: false |
| videoCall                     | Enable video, voice  & chat features                                          |    Default: false |
| disableVideo                  | When true: Disables video & voice features, allows chat only                  |    Default: false |
| disableChat               | When true: Disables the chat feature, allows video & voice only         |  Default: false |
| devmode               | Devevelopment mode, informative console logs are disabled is set to false     |    Default: false |
| onSocketConnected       | Function to be fired when socket connection is succesful              |    `function(){ console.log("socket connected");` |
| onSocketError         | Function to be fired when socket connection fails                 |    `function(){ console.error("socket connection failed");}` |





License
----

MIT
