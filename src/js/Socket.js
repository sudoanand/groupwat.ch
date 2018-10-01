/**
 * Socket.js
 * A controller for the WebSocket events and communications for the video player 
 * @author Anand Singh <@hack4mer> https://anand.today
 */ 

import $ from 'jquery';
import {Utilities} from './Utilities'


/**
 * socket constructor
 * @param  {string} SOCKET_SERVER Hostname of the socket server
 */
export const Socket = function(socket_server){

  this.wsUri      = socket_server;  
  this.websocket  = new WebSocket(this.wsUri);

  this.websocket.onopen     = Utilities.onSocketConnected.bind(this);  
  this.websocket.onmessage  = this.onMessage;
  this.websocket.onerror    = Utilities.onSocketError.bind(this);
  this.websocket.onclose    = Utilities.onSocketError.bind(this);

  this.notificationAudio    = new Audio('../dist/audio/to-the-point.mp3');
}


Socket.prototype.playNotificationSound = function(){
  console.log("ok");
  this.notificationAudio.play();
}


Socket.prototype.onMessage = function(ev){

  var response    = JSON.parse(ev.data); //Server sends Json string

  if(response.key=="chat"){

    console.log(response);

    var chatMsg = document.createElement("p");
    chatMsg.innerHTML = response.value
    chatMsg.style.color = "red";
    chatMsg.style['text-align'] = "left";


    var chatHolder = document.getElementsByClassName(Utilities.config.chatBoxPaperClass)[0];
    chatHolder.appendChild(chatMsg);
    chatHolder.scrollTop = chatHolder.scrollHeight;

    this.playNotificationSound();
    return ;
  }


  if(!Utilities.video){ return;} //Video has not been initialized yet



  //Do not notify others about this player event since it was triggered by someone else
  Utilities.video.notifyPeers = false; 
  
  Utilities.log("Socket message received:",Utilities.video.notifyPeers); 
  if(Utilities.logging){
    console.log(response);
  }

  console.log(response);

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
  }
  else{

    //Remove the notification lock
    Utilities.video.notifyPeers = true; 
  }
};

/**
 * Socket connection error handler
 * @param  {event} ev event object 
 */
Socket.prototype.onError = Utilities.onSocketError