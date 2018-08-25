<!DOCTYPE html>
<html>
<head>
  <link href="https://vjs.zencdn.net/7.1.0/video-js.css" rel="stylesheet">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/video.js/7.2.1/video.min.js"></script>
  <style type="text/css">
    #my-video{
      display: none;
    }
  </style>
</head>

<body>

  <center style="margin-top:50px">

    <video id="my-video"  class="video-js" controls preload="auto" width="640" height="264">
      <source id="my-video-src" src="" type='video/mp4'>
      <track kind='captions' src='mov.vtt' srclang='en' label='English' default/>
      <p class="vjs-no-js">
        To view this video please enable JavaScript, and consider upgrading to a web browser that
        <a href="https://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
      </p>
    </video>



    <input type="file" name="srcVideo" id="srcVideo">

    <div id="log"></div>

    </center>

  <script src="https://vjs.zencdn.net/7.1.0/video.js"></script>
  <script type="text/javascript">

    $(function() {

        $("#srcVideo").change(function(){

            var src = window.URL.createObjectURL(this.files[0]);
            $("#my-video-src").attr("src",src);
            initVidJs();
            $("#my-video").show();
            $("#srcVideo").hide();
            console.log(src);
        });
    });

    lastSeekValue = false;
    videoSeeking  = false;

    function initVidJs(){


                  var options = {};

                      player = videojs('my-video', options, function onPlayerReady() {

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
  </script>

  <script language="javascript" type="text/javascript">  
    //create a new WebSocket object.
    var msgBox = $('#log');
    var wsUri = "ws://<?php echo $_SERVER['HTTP_HOST'];?>:12345/server.php";  
    websocket = new WebSocket(wsUri); 


    
    websocket.onopen = function(ev) { // connection is open 
      msgBox.append('<div class="system_msg" style="color:#bbbbbb">Welcome to my "Demo WebSocket Chat box"!</div>'); //notify user
    }
    // Message received from server
    websocket.onmessage = function(ev) {
      var response    = JSON.parse(ev.data); //PHP sends Json data
     
      console.log(response); 

      if(response.key=="seek_value"){
        player.currentTime(response.value);
        player.play();
        lastSeekValue = response.value;
      }

      if(response.key=="pause"){
        player.pause("andy");
      }

      if(response.key=="play"){
        player.play();
      }


    };
    
    websocket.onerror = function(ev){ msgBox.append('<div class="system_error">Error Occurred - ' + ev.data + '</div>'); }; 
    websocket.onclose   = function(ev){ msgBox.append('<div class="system_msg">Connection Closed</div>'); }; 

    //Message send button
    $('#send-message').click(function(){
      send_message();
    });
    
    //User hits enter key 
    $( "#message" ).on( "keydown", function( event ) {
      if(event.which==13){
        send_message();
      }
    });
    
    //Send message
    function send_message(){
      var message_input = $('#message'); //user message text
      var name_input = $('#name'); //user name
      
      if(message_input.val() == ""){ //empty name?
        alert("Enter your Name please!");
        return;
      }
      if(message_input.val() == ""){ //emtpy message?
        alert("Enter Some message Please!");
        return;
      }

      //prepare json data
      var msg = {
        message: message_input.val(),
        name: name_input.val(),
        color : '#000'
      };
      //convert and send data to server
      websocket.send(JSON.stringify(msg));  
      message_input.val(''); //reset message input
    }
  </script>
</body>
</html>