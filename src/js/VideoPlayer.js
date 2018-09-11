/**
 * VideoPlayer
 * A controller class for the VideoJS player events
 * @author Ananad <@hack4mer> https://anand.today
 */

import videojs from 'video.js';
import {websocket} from './Socket';
import {mGwatch} from './index'

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
    mGwatch.log('Your player is ready!');
  

    //Video seeking event handler
    this.on("seeking", function (e) {
      _.videoSeeking = true;
      mGwatch.log("Video seeking: " + this.currentTime());
    });

    //Video pause event handler
    this.on('pause', function(e) {

      var socketPayload = {
        name: mGwatch.session_identifier,
        key: "pause",
        value : true
      };


      if(_.notifyPeers){
        
        //Notify peers
        mGwatch.log("Video paused","Sending socket message");            
        if(mGwatch.config.devmode){
          console.log(socketPayload)
        }

        websocket.send(JSON.stringify(socketPayload)); 
      }

      //Remove the notification lock, if present
      _.notifyPeers = true; 
    });

    //Video play event handler
    this.on('play', function() {

      if(_.videoSeeking){return;}

      var socketPayload = {
        name: mGwatch.session_identifier,
        key: "play",
        value : true
      };

      

      if(_.notifyPeers){

        //Notify peers
        mGwatch.log("Video played","Sending socket message");
        if(mGwatch.config.devmode){
          console.log(socketPayload)
        }
        websocket.send(JSON.stringify(socketPayload)); 
      }
      
      //Remove the notification lock, if present
      _.notifyPeers = true; 
    });

    //Video seeke happened event handler
    this.on("seeked", function (e) {

      _.videoSeeking = false;
      var seekedTo = this.currentTime();

      if(seekedTo==_.lastSeekValue){ return;}

      mGwatch.log("Video seeked");

      var socketPayload = {
        name: mGwatch.session_identifier,
        key: "seek_value",
        value : {time : seekedTo, play: !this.paused()}
      };

      _.lastSeekValue = seekedTo;
      
      if(_.notifyPeers){

        //Notify peers
        mGwatch.log("Sending seeked singal message");
        if(mGwatch.config.devmode){
          console.log(socketPayload)
        }
        websocket.send(JSON.stringify(socketPayload)); 
      }

      //Remove the notification lock, if present
      _.notifyPeers = true; 
    });
  });
}