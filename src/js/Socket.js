/**
 * Socket.js
 * A controller for the WebSocket events and communications
 * @author Anand Singh <@hack4mer> https://anand.today
 */ 

import $ from 'jquery';
import {mGwatch} from './index'


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
  this.msgBox.html('<div class="system_msg" style="color:#bbbbbb">Socket connected, Connection id: '+mGwatch.session_identifier+'</div>'); //notify user
}


Socket.prototype.onMessage = function(ev){

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

/**
 * Socket connection error handler
 * @param  {event} ev event object 
 */
Socket.prototype.onError = function(ev){
  this.msgBox.html('<div class="system_msg" style="color:red">Socket connection lost/failed! reload the page to retry...</div>');
}; 