/**
 * VideoPlayer
 * A controller class for the VideoJS player events
 * All the socket notifications are sent by this class
 * @author Ananad <@hack4mer> https://anand.today
 */

import videojs from 'video.js';
import {Utilities} from './Utilities';

/**
 * Constructor for the videoJS player controller
 */
export class VideoPlayer{

  constructor(){
    var options = {};

    this.lastSeekValue = 0;
    this.videoSeeking = 0;


    //Decides wether to send event notification to others through the socket   
    this.notifyPeers = true;

    //Initialize the videojs player
    this.player = videojs('my-video', options, this.onPlayerReady.bind(this));

    //Add subtitle button
    this.addNewButton({
      "id":"addSubsBtn",
      "icon":"icon-speech"
    },this.onAddSubBtnClicked.bind(this));
  }

  /**
   * Adds new button to the player
   * @param {object} data an object with valid keys : icon,id
   * @param {function} onClickListener A click listener for the added button
   */
  addNewButton(data,onClickListener) {

    var myPlayer = this.player,
        controlBar,
        insertBeforeNode,
        newElement = document.createElement('div'),
        newLink = document.createElement('a');

    newElement.id = data.id;
    newElement.className = 'vjs-custom-icon vjs-control';

    newLink.innerHTML = "<i class='icon " + data.icon + " line-height' aria-hidden='true'></i>";
    newElement.appendChild(newLink);
    controlBar = document.getElementsByClassName('vjs-control-bar')[0];

    insertBeforeNode = document.getElementsByClassName('vjs-fullscreen-control')[0];
    controlBar.insertBefore(newElement, insertBeforeNode);


    if(typeof onClickListener!="undefined"){
      newElement.onclick = onClickListener; //Add the click listener
    }

    return newElement;
  }



  /**
   * Handles click event for the "Add subtitle button"
   * @return {[type]} [description]
   */
  onAddSubBtnClicked(){

    var tempFileInput = $('<input/>').attr('type', 'file');
    tempFileInput.change(this.onSubChanged.bind(this));

    //Open the file dialog to select subtitle
    tempFileInput.trigger('click');
  }



  /**
   * Handles the event of a subtitle being changed or added
   * @param {event} e  jQuery event object
   */
  onSubChanged(e){

    var 
    file    = e.target.files[0],
    fileUrl = window.URL.createObjectURL(file);

    //Remove old tracks
    var oldTracks = this.player.remoteTextTracks();
    var i = oldTracks.length;
    while (i--) {
      this.player.removeRemoteTextTrack(oldTracks[i]);
    }

    //Add the track to the player
    this.player.addRemoteTextTrack({ src:fileUrl, kind:'captions', label:'captions on' })

    //enable the current subtitle
    this.player.remoteTextTracks()[0].mode='showing';
  }



  /**
   * Handles videojs player events and notifies peers about the event 
   * 
   */
  onPlayerReady() {

    //Palyer is ready
    Utilities.log('Your player is ready!');

    //Video seeking event handler
    this.player.on("seeking", function (e) {
      this.videoSeeking = true;
      Utilities.log("Video seeking: " + this.player.currentTime());
    }.bind(this));

    //Video pause event handler
    this.player.on('pause', function(e) {

      var socketPayload = {
        name: Utilities.session_identifier,
        key: "pause",
        value : true
      };


      if(this.notifyPeers){
        
        //Notify peers
        Utilities.log("Video paused","Sending socket message");            
        if(Utilities.logging){
          console.log(socketPayload)
        }

        Utilities.websocket.send(JSON.stringify(socketPayload)); 
      }

      //Remove the notification lock, if present
      this.notifyPeers = true; 
    }.bind(this));

    //Video play event handler
    this.player.on('play', function() {

      if(this.videoSeeking){return;}

      var socketPayload = {
        name: Utilities.session_identifier,
        key: "play",
        value : true
      };

      

      if(this.notifyPeers){

        //Notify peers
        Utilities.log("Video played","Sending socket message");
        if(Utilities.logging){
          console.log(socketPayload)
        }
        Utilities.websocket.send(JSON.stringify(socketPayload)); 
      }
      
      //Remove the notification lock, if present
      this.notifyPeers = true; 
    }.bind(this));

    //Video seeke happened event handler
    this.player.on("seeked", function (e) {

      this.videoSeeking = false;
      var seekedTo = this.player.currentTime();

      if(seekedTo==this.lastSeekValue){ return;}

      Utilities.log("Video seeked");

      var socketPayload = {
        name: Utilities.session_identifier,
        key: "seek_value",
        value : {time : seekedTo, play: !this.player.paused()}
      };

      this.lastSeekValue = seekedTo;
      
      if(this.notifyPeers){

        //Notify peers
        Utilities.log("Sending seeked singal message");
        if(Utilities.logging){
          console.log(socketPayload)
        }
        Utilities.websocket.send(JSON.stringify(socketPayload)); 
      }

      //Remove the notification lock, if present
      this.notifyPeers = true; 
    }.bind(this));
  }
}