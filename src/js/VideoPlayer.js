/**
 * VideoPlayer
 * A controller class for the VideoJS player events
 * All the socket notifications are sent by this class
 * @author Ananad <@hack4mer> https://anand.today
 */

import videojs from 'video.js';
import {Utilities} from './Utilities';
import VTTConverter from 'srt-webvtt'; 

/**
 * Constructor for the videoJS player controller
 */
export class VideoPlayer{

  constructor(){
    var options = {
      controlBar: {
        fullscreenToggle: false
      }
    };

    this.fullscreenmode = false;

    this.lastSeekValue = 0;
    this.videoSeeking = 0;


    //Decides wether to send event notification to others through the socket   
    this.notifyPeers = true;

    //Initialize the videojs player
    console.log(Utilities.config.mainPlayerId);
    this.player = videojs(Utilities.config.mainPlayerId, options, this.onPlayerReady.bind(this));

    //Add subtitle button
    this.addNewButton({
      "id":"addSubsBtn",
      "icon":"icon-speech",
      "title":"Add subtitle",
    },this.onAddSubBtnClicked.bind(this));

    //Add subtitle button
    this.addNewButton({
      "id":"fullScreenToogleBtn",
      "icon":"icon-size-fullscreen",
      "title":"Toggle fullscreen mode",
    },this.toggleFullScreen.bind(this));
  }

  /**
   * Toggles the container to fullscreen
   */
  toggleFullScreen(){
    var video_con = document.getElementById(Utilities.config.container);

    if(this.fullscreenmode){

      //Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
      }

      this.fullscreenmode =false;
      video_con.classList.remove("fullscreen_vidjs");

    }else{    

      //Enter fullscreen
      if (video_con.requestFullscreen) {
          video_con.requestFullscreen();
          this.fullscreenmode = true;
      } else if (video_con.mozRequestFullScreen) {
          video_con.mozRequestFullScreen();
          this.fullscreenmode = true;          
      } else if (video_con.webkitRequestFullscreen) {
          video_con.webkitRequestFullscreen();
          this.fullscreenmode = true;          
      }

        video_con.classList.add("fullscreen_vidjs");
    }
  }


  /**
   * Adds new button to the player
   * @param {object} data an object with valid keys : icon,id,title
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

    newLink.innerHTML = "<i title='"+data.title+"' class='icon " + data.icon + " line-height' aria-hidden='true'></i>";
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

    var tempFileInput = $('<input/>').attr('type', 'file').attr('accept','.vtt,.srt');
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
    file       = e.target.files[0],
    fileExt    = file.name.slice(-3),
    fileUrl;

    //Convert to .vtt if the selected file is .srt
    if(fileExt=="srt"){

      //a .srt file is selected
      //covert it and enable it
      this.setSrtSubtitle(file);
    }else if(fileExt=="vtt"){

      //.vtt is selected, no coversion required
      fileUrl    = window.URL.createObjectURL(file),
      this.setSubtitle(fileUrl);
    }else{


      Utilities.notifyError("Only .srt and .vtt files are supported as subtitles");
    }
  }



  /**
   * Sets a given ur as the subtitle of the playing video, removes old ones
   * @param {string} url remote url to be used as source for the subtitle
   */
  setSubtitle(fileUrl){
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
   * converts a .srt subtitle file to .vtt file and activates it 
   * @param  {file} file selected subtitle file
   */
  setSrtSubtitle(file){
    var _ = this;
    const vttConverter = new VTTConverter(file);

    vttConverter
    .getURL()
    .then(function(url) { 

      //.vtt generated      
      //Enable the subtitles
      _.setSubtitle(url);
    })
    .catch(function(err) {

      //Error occured during conversion
      Utilities.notifyError("Selected .srt file seems to be invalid");
      console.error(err);
    })
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