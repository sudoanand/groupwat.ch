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
            container : options.container || false,
            src : options.src || false,
            videoCall : options.videoCall || false,
            devmode : options.devmode || false,
            videoSelector : options.videoSelector ? $("#"+options.videoSelector) : $("#video-selector"),
            socket_server : options.socket_server || false,
            onSocketConnected : options.onSocketConnected || function(){ console.log("socket connected");},
            onSocketError : options.onSocketError || function(){ Utilities.notifyError("socket connection failed"); },
            mainPlayerId : "GWatch_mainPlayer",
            mainPlayerSrcId : "GWatch_mainPlayerSrc",
            containerClass : "GWatch_container",
        };

        if(!this.config.container){
            Utilities.notifyError("GWatch: Please specify the container option.");
            return;
        }
        else if(!this.config.socket_server){
            Utilities.notifyError("GWatch: Please specify the socket_server option.");
            return;
        }

        this.containerEle  = document.getElementById(options.container);


        //A placeholder for an instance of the VideoPlayer
        this.video = null;

        //show the video player
        this.showVideoContainer();


        //Creates the required dom elements
        this.initializeUIElements();

        //Attach jQuery UI events to the dom elements
        this.initializeUIEvents();        




        //Set utility options
        Utilities.config               = this.config;                     // If the logs should appera in the console
        Utilities.logging               = this.config.devmode;                     // If the logs should appera in the console
        Utilities.session_identifier    = this.generateConnectionId();             //A unique identifier for the socket connection    
        Utilities.onSocketConnected     = this.config.onSocketConnected; 
        Utilities.onSocketError         = this.config.onSocketError;
        Utilities.mSocket               = new Socket(this.config.socket_server);   //Initialize the socket class    
        Utilities.websocket             = Utilities.mSocket.websocket;             //A global variable containing websocket connection object    


        //Initialize videocallui
        if(this.config.videoCall){
            //Place holder for remote vidoe stream holders
            this.videoCallPanelRemoteStream = [];

            this.initializeVideoCallUI();
        }else{
            document.getElementById("GWatch_playerContainer").style.width = "100%";
        }



        if(this.config.videoCall){            
            //Initialzie the webrtc class and expose it as a public property of this class        
            this.webRTC = new WebRTC();
        }


        //Enable panel resizer 
        this.enablePanelResizer();

        //Initialize the player if src is provided
        if(this.config.src){
            this.changePlayerSource(this.config.src);
        }
    }

    /**
     * Creates required dom elements and appends in it
     * @return {[type]} [description]
     */
    initializeUIElements(){
        //Add the container class
        this.containerEle.classList.add(this.config.containerClass);

        //Setup the main video player
        //Create a conatainer
        this.mainVideoPlayerContainer = document.createElement("div");
        this.mainVideoPlayerContainer.setAttribute("id","GWatch_playerContainer");
        
        //Create video tag
        this.mainVideoPlayer = document.createElement("video");
        this.mainVideoPlayer.setAttribute("controls",true);
        this.mainVideoPlayer.setAttribute("id",this.config.mainPlayerId);
        this.mainVideoPlayer.setAttribute("class","video-js");
        this.mainVideoPlayer.setAttribute("preload","auto");

        //Create source tag
        this.mainVideoPlayerSrc = document.createElement("source");
        this.mainVideoPlayerSrc.setAttribute("class",this.config.mainVideoPlayerSrcId);
        this.mainVideoPlayerSrc.setAttribute("src","");
        this.mainVideoPlayerSrc.setAttribute("type","video/mp4");

        //Create no js support tag
        this.mainVideoPlayerP = document.createElement("p");
        this.mainVideoPlayerP.setAttribute("class","vjs-no-js");
        this.mainVideoPlayerP.innerHTML = 'To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="https://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>';

        //Add the video tag in the container
        this.mainVideoPlayer.appendChild(this.mainVideoPlayerSrc); // Add the source tag inside the video tag
        this.mainVideoPlayer.appendChild(this.mainVideoPlayerP); // Add the p tag inside the video tag
        this.mainVideoPlayerContainer.appendChild(this.mainVideoPlayer); //Add the video player in its container

        this.containerEle.appendChild(this.mainVideoPlayerContainer); //Add the video tag inside the container
    }

    initializeVideoCallUI(){

        //Create panel container
        this.videoCallPanel = document.createElement("div");
        this.videoCallPanel.setAttribute("id","GWatch_camContainer");

        //Create panel resizer
        this.videoCallPanelResizer = document.createElement("div");
        this.videoCallPanelResizer.setAttribute("id","GWatch_panResizer");

        //Create video tag for localstream
        this.videoCallPanelLocalStream = this.createVideoStreamHolder({
            id : "localVideo",
            autoplay : true,
            muted : true,

        });

        //Create video tag for first remote stream
        this.videoCallPanelRemoteStream[0] = this.createVideoStreamHolder({
            id : "remoteVideo",
            autoplay : true
        });


        //Add all of the above to panel container
        this.videoCallPanel.appendChild(this.videoCallPanelResizer);
        this.videoCallPanel.appendChild(this.videoCallPanelLocalStream);
        this.videoCallPanel.appendChild(this.videoCallPanelRemoteStream[0]);

        //Add the video panel to dom
        this.containerEle.appendChild(this.videoCallPanel);
    }


    createVideoStreamHolder(attrs){

        var videoHolder = document.createElement("video");

        videoHolder.classList.add("mirrored_video");

        for(var key in attrs){
            videoHolder.setAttribute(key,attrs[key]);
        }


        return videoHolder;
    }


    /**
     * Enable player resizer
     */
    enablePanelResizer(){

        this.isResizing = false,    
        this.lastDownX = 0;


        var container = $('#'+Utilities.config.container),
            left = $('#GWatch_playerContainer','#'+Utilities.config.container),
            right = $('#GWatch_camContainer','#'+Utilities.config.container),
            handle = $('#GWatch_panResizer','#'+Utilities.config.container);

        handle.on('mousedown', function (e) {
            this.isResizing = true;
            this.lastDownX = e.clientX;
        }.bind(this));

        $(document).on('mousemove', function (e) {

            // we don't want to do anything if we aren't resizing.
            if (!this.isResizing) 
                return;
            
            var offsetRight = e.clientX;
            var offseLeft = container.width()-offsetRight;

            if(offsetRight > container.width()){
                return ;
            }

            left.css('width', offsetRight);
            right.css('width', offseLeft);
        }.bind(this)).on('mouseup', function (e) {
            // stop resizing
            this.isResizing = false;
        }.bind(this));
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
        this.containerEle.getElementsByClassName(this.config.mainVideoPlayerSrcId)[0].setAttribute("src",newSrc);

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


    /**
    * Makes the main video player visible
    */
    showVideoContainer(){
        //Show video container
        //this.config.videoElement.parent().fadeIn();
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