# GroupWat.ch
Make your own video room to watch videos remotely with all your friends

### Features

- Play videos  in sync with people from anywhere on the globe
- Support .srt and .vtt subtitles, can be added from your local disk
- Play your local video files [No downloding or streaming]
- [Video.js](https://github.com/videojs/video.js) video player, highly customizable and open-source 
- Uses WebSocket server  not WebRTC, hence easy to deploy without HTTPS
- Handy to use as a standalone in your web-browser

## Installation
It's very easy to run groupwat.ch on your server (or localhost), it needs `php-cli` installed.

- Step 1 : Clone the repo or [Download Zip](https://github.com/hack4mer/groupwat.ch/archive/master.zip) archive
- Step 2: Start the websocket server by running `php -q socket_server/server.php`

That's it, now visit the index.html page and if all went well, you will see: 
`Socket connected!` 

If your socket connection fails that means , either:
- socket is not running, run it by step 2
- or, the your firewall is blocking the port on which the websocket is running

### Docs
  Coming up...

License
----

MIT