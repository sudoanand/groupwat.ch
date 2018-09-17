/**
 * Gwatch.js
 * A controller class for the vidoe player and index page functionalities
 * @author Anand Singh <@hack4mer> https://anand.today
 */
import {VideoPlayer} from './VideoPlayer'
import $ from 'jquery';
import {Socket} from './Socket'
import {Utilities} from './Utilities'
import {WebRTC} from './WebRTC'
import styles from '../css/app.css'

/**
 * GWatch constructor
 * @param {object} options configuration object for the GroupWat.ch player
 */
class GWatch{


    constructor(options){

        //options and config
        this.config = {
            videoElement :  options.videoId ? $("#"+options.videoId) : $('#my-video'),
            videoSelector : options.videoSelector ? $("#"+options.videoSelector) : $("#video-selector"),
            videoSrcElement : options.videoSrcElement ? $("#"+options.videoSrcElement)  : $("#my-video-src"),
            devmode : options.devmode || false,
            socket_server : options.socket_server || 'ws://'+window.location.hostname+':12345',
            onSocketConnected : options.onSocketConnected || function(){ console.log("socket connected");},
            onSocketError : options.onSocketError || function(){ console.error("socket connection failed");}
        };


        //A placeholder for an instance of the VideoPlayer
        this.video = null;

        //show the video player
        this.showVideoContainer();

        //Attach jQuery UI events to the dom elements
        this.initializeUIEvents();        

        //Start the videocall
        this.startVideoCall = new WebRTC().start;



        //Set utility options
        Utilities.logging = this.config.devmode;                                            // If the logs should appera in the console
        Utilities.session_identifier = this.generateConnectionId();                         //A unique identifier for the socket connection    
        Utilities.onSocketConnected = this.config.onSocketConnected; 
        Utilities.onSocketError     = this.config.onSocketError;
        Utilities.websocket = new Socket(this.config.socket_server).websocket;   //Initialize the socket class    
    }


    /**
     * Initializes jQuery events to the DOM elements
     */
    initializeUIEvents(){

        Utilities.log("Initializing UI events");

        //on video src change
        this.config.videoSelector.change(this.onSrcSelected.bind(this));
    }

    /**
     * Event handler for the change in video selector input file 
     */
    onSrcSelected(e){

        var 
            file    = e.target.files[0],
            fileUrl = window.URL.createObjectURL(file);

        Utilities.log("New source file selected");

        //Configure the player to use newly selected source
        this.changePlayerSource(fileUrl)
    }

    /**
    * Changes video source and configures the player to use it
    * @param  {string} newSrc the new video source to be applied
    */
    changePlayerSource(newSrc){

        Utilities.log("Changing player's source");

        //Change src element
        this.config.videoSrcElement.attr("src",newSrc);

        if(typeof Utilities.player=="undefined"){

            //Initialize video player
            Utilities.video = new VideoPlayer();
            Utilities.player = Utilities.video.player;
        }else{

            //Video player already initialized
            //Change video player source
            Utilities.player.src({type:'video/mp4', src:newSrc});
            Utilities.player.load();
        }
    }

    showVideoContainer(){


        //Show video container
        this.config.videoElement.parent().fadeIn();
    }

    /**
    * Generates a random string to use as an identifier for the socket connection
    * @return {[type]} [description]
    */
    generateConnectionId(){
        var date = new Date();
        return btoa(unescape(encodeURIComponent(date.getTime()+Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)))).slice(0,-2);
    }

}

module.exports = GWatch;