var VideoPlayer = function(){

  var options = {};

  this.player = videojs('my-video', options, function onPlayerReady() {

    videojs.log('Your player is ready!');

    this.play();

    
    this.on('ended', function() {
      videojs.log('Awww...over so soon?!');
    });


    this.on("seeking", function (e) {
      videoSeeking = true;
      console.log("Video seeking: " + this.currentTime());
    });


    this.on('pause', function(e) {

      console.log(e);

      console.log("paused",this.paused());

        websocket.send(JSON.stringify({
          name: "andy",
          key: "pause",
          value : true
        })); 
    });

    this.on('play', function() {

      if(videoSeeking){return;}

      console.log("played",this.paused());

       websocket.send(JSON.stringify({
          name: "andy",
          key: "play",
          value : true
        })); 
    });

    this.on("seeked", function (e) {

        videoSeeking = false;
        var seekedTo = this.currentTime();

        if(seekedTo==lastSeekValue){ return;}

        lastSeekValue = seekedTo;
        websocket.send(JSON.stringify({
          name: "andy",
          key: "seek_value",
          value : seekedTo
        }));        
    });
  });
}