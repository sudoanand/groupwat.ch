/**
 * Socket.js
 * A controller for the WebSocket events and communications
 * @author Anand Singh <@hack4mer> https://anand.today
 */ 

import $ from 'jquery';
import {Utilities} from './Utilities'


/**
 * socket constructor
 * @param  {string} SOCKET_SERVER Hostname of the socket server
 */
export const Socket = function(socket_server,socket_port){

  var port = socket_port || 12345;

  this.wsUri      = "ws://"+socket_server+":"+socket_port;  
  this.websocket  = new WebSocket(this.wsUri);
  this.msgBox     = $('#log');

  this.websocket.onopen     = this.onConnected.bind(this);  
  this.websocket.onmessage  = this.onMessage;
  this.websocket.onerror    = this.onError.bind(this);
  this.websocket.onclose    = this.onError.bind(this);
}

Socket.prototype.onConnected = function(ev) { 
  // connection is open 
  this.msgBox.html('<div class="system_msg" style="color:#bbbbbb">Socket connected, Connection id: '+Utilities.session_identifier+'</div>'); //notify user
}


Socket.prototype.onMessage = function(ev){

  var response    = JSON.parse(ev.data); //PHP sends Json data
 

  if(response.name==Utilities.session_identifier || !Utilities.video){
    //This is a message from self
    //or the video is not initialized yet
    //Hence, ignore
    return;
  }


  //Do not notify others about this seek event since it was triggered by someone else
  Utilities.video.notifyPeers = false; 
  
  Utilities.log("Socket message received:",Utilities.video.notifyPeers); 
  if(Utilities.logging){
    console.log(response);
  }




  if(response.key=="seek_value"){

    Utilities.player.currentTime(response.value.time); //Seek the video

    if(response.value.play){
      Utilities.player.play(); //Play if the peers video is playing
    }    
  }else if(response.key=="pause" && !Utilities.player.paused()){

    //Pause the video as requested by the peer
    Utilities.player.pause();
  }else if(response.key=="play" && Utilities.player.paused()){

    //Play the video as requested by the peer
    Utilities.player.play();
  }else{

    //Remove the notification lock
    Utilities.video.notifyPeers = true; 
  }
};

/**
 * Socket connection error handler
 * @param  {event} ev event object 
 */
Socket.prototype.onError = function(ev){
  this.msgBox.html('<div class="system_msg" style="color:red">Socket connection lost/failed! reload the page to retry...</div>');
}; 