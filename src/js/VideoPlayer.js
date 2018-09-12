/**
 * VideoPlayer
 * A controller class for the VideoJS player events
 * @author Ananad <@hack4mer> https://anand.today
 */

import videojs from 'video.js';
import {Utilities} from './Utilities';

/**
 * Constructor for the videoJS player controller
 */
export const VideoPlayer = function(){

  var options = {},_=this;
  this.lastSeekValue = 0;
  this.videoSeeking = 0;


  //decides wether to send event notification ot others through the socket   
  this.notifyPeers = true;

  //Initialize the videojs player
  this.player = videojs('my-video', options, function onPlayerReady() {

    //Palyer is ready
    Utilities.log('Your player is ready!');
  

    //Video seeking event handler
    this.on("seeking", function (e) {
      _.videoSeeking = true;
      Utilities.log("Video seeking: " + this.currentTime());
    });

    //Video pause event handler
    this.on('pause', function(e) {

      var socketPayload = {
        name: Utilities.session_identifier,
        key: "pause",
        value : true
      };


      if(_.notifyPeers){
        
        //Notify peers
        Utilities.log("Video paused","Sending socket message");            
        if(Utilities.logging){
          console.log(socketPayload)
        }

        Utilities.websocket.send(JSON.stringify(socketPayload)); 
      }

      //Remove the notification lock, if present
      _.notifyPeers = true; 
    });

    //Video play event handler
    this.on('play', function() {
      
      if(_.videoSeeking){return;}

      var socketPayload = {
        name: Utilities.session_identifier,
        key: "play",
        value : true
      };

      

      if(_.notifyPeers){

        //Notify peers
        Utilities.log("Video played","Sending socket message");
        if(Utilities.logging){
          console.log(socketPayload)
        }
        Utilities.websocket.send(JSON.stringify(socketPayload)); 
      }
      
      //Remove the notification lock, if present
      _.notifyPeers = true; 
    });

    //Video seeke happened event handler
    this.on("seeked", function (e) {

      _.videoSeeking = false;
      var seekedTo = this.currentTime();

      if(seekedTo==_.lastSeekValue){ return;}

      Utilities.log("Video seeked");

      var socketPayload = {
        name: Utilities.session_identifier,
        key: "seek_value",
        value : {time : seekedTo, play: !this.paused()}
      };

      _.lastSeekValue = seekedTo;
      
      if(_.notifyPeers){

        //Notify peers
        Utilities.log("Sending seeked singal message");
        if(Utilities.logging){
          console.log(socketPayload)
        }
        Utilities.websocket.send(JSON.stringify(socketPayload)); 
      }

      //Remove the notification lock, if present
      _.notifyPeers = true; 
    });
  });
}