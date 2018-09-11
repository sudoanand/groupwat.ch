/**
 * Socket.js
 * A controller for the WebSocket events and communications
 * @author Anand Singh <@hack4mer> https://anand.today
 */ 

import $ from 'jquery';
import {mGwatch} from './index'


const SOCKET_SERVER = window.location.hostname;  


//create a new WebSocket object.
var msgBox = $('#log');
var wsUri = "ws://"+SOCKET_SERVER+":12345/server.php";  
export var websocket = new WebSocket(wsUri); 



websocket.onopen = function(ev) { // connection is open 
  msgBox.html('<div class="system_msg" style="color:#bbbbbb">Socket connected, Connection id: '+mGwatch.session_identifier+'</div>'); //notify user
}

// Message received from server
websocket.onmessage = function(ev){
  var response    = JSON.parse(ev.data); //PHP sends Json data
 

  if(response.name==mGwatch.session_identifier || !mGwatch.video){
    //This is a message from self
    //or the video is not initialized yet
    //Hence, ignore
    return;
  }


  //Do not notify others about this seek event since it was triggered by someone else
  mGwatch.video.notifyPeers = false; 
  
  mGwatch.log("Socket message received:",mGwatch.video.notifyPeers); 
  if(mGwatch.config.devmode){
    console.log(response);
  }




  if(response.key=="seek_value"){

    mGwatch.player.currentTime(response.value.time); //Seek the video

    if(response.value.play){
      mGwatch.player.play(); //Play if the peers video is playing
    }    
  }else if(response.key=="pause" && !mGwatch.player.paused()){

    //Pause the video as requested by the peer
    mGwatch.player.pause();
  }else if(response.key=="play" && mGwatch.player.paused()){

    //Play the video as requested by the peer
    mGwatch.player.play();
  }else{

    //Remove the notification lock
    mGwatch.video.notifyPeers = true; 
  }
};

function connection_error(ev){ msgBox.html('<div class="system_msg" style="color:red">Socket connection lost/failed! reload the page to retry...</div>'); }; 

websocket.onerror  = connection_error;
websocket.onclose   = connection_error;
