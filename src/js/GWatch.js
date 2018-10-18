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
import {Events} from './Events'
import styles from '../css/app.css'
import smallscreen_styles from '../css/app.smallscreen.css'

/**
 * GWatch constructor
 * @param {object} options configuration object for the GroupWat.ch player
 */
class GWatch{


    constructor(options){

        //options and config
        this.config = {
            //configurable via the api
            container : options.container || false,
            src : options.src || false,
            videoCall : options.videoCall || false,
            devMode : options.devMode || false,
            socketServer : options.socketServer || false,
            localSource : options.localSource || false,
            disableChat : options.disableChat || false,
            disableVideo : options.disableVideo || false,

            //New options
            peerInfo: options.peerInfo || false,
            videoStartBtn: options.videoStartBtn===false ? false:true,
            playerOptions: options.playerOptions || {},
            
            onSocketConnected : options.onSocketConnected || function(){ console.log("socket connected");},
            onSocketError : options.onSocketError || function(){ console.error("socket connection failed"); },

            //hardcoded configurations
            mainPlayerId : "GWatch_mainPlayer",
            mainVideoPlayerSrcId : "GWatch_mainPlayerSrc",
            containerClass : "GWatch_container",
            chatBoxPaperClass : "GWatch_chatBoxPaper",
            videoStartBtnClass : "GWatch_startVideo",
        };

        this.events = Events;

        if(!this.config.container){
            Utilities.notifyError("GWatch: Please specify the container option.");
            return;
        }
        else if(!this.config.socketServer){
            Utilities.notifyError("GWatch: Please specify the socketServer option.");
            return;
        }else if(!this.config.localSource && !this.config.src){
            Utilities.notifyError("GWatch: Please provide src or set localSource to true.");
            return;
        }

        this.container  = document.getElementById(options.container);

        this.container.style.display = "flex";


        //A placeholder for an instance of the VideoPlayer
        this.video = null;


        //Creates the required dom elements
        this.initializeUIElements();
        this.uuid = Utilities.createUUID();

        //Generate UUID
        Utilities.uuid = this.uuid;

        //Set utility options
        Utilities.config                = this.config;                     // If the logs should appera in the console
        Utilities.container             = this.container;                     // If the logs should appera in the console
        Utilities.events                = Events;                     // If the logs should appera in the console
        Utilities.logging               = this.config.devMode;                     // If the logs should appera in the console
        Utilities.session_identifier    = this.generateConnectionId();             //A unique identifier for the socket connection    
        Utilities.onSocketConnected     = this.config.onSocketConnected; 
        Utilities.onSocketError         = this.config.onSocketError;
        Utilities.mSocket               = new Socket(this.config.socketServer);   //Initialize the socket class    
        Utilities.websocket             = Utilities.mSocket.websocket;             //A global variable containing websocket connection object    


        //Initialize videocallui
        if(this.config.videoCall){

            //Place holder for remote vidoe stream holders
            this.videoCallPanelRemoteStream = [];

            //Insert required elements in the dom
            this.initializeVideoCallUI();

            if(!Utilities.config.disableVideo){            
                //Initialzie the webrtc class and expose it as a public property of this class        
                this.webRTC = new WebRTC();
            }

        }else{
            document.getElementById("GWatch_playerContainer").style.width = "100%";
        }


        //Enable panel resizer 
        this.enablePanelResizer();

        //Enable chat resizer 
        this.enableChatResizer();

        //Initialize the player if src is provided
        if(this.config.src){
            this.changePlayerSource(this.config.src);
        }

        //If local file selector is requested
        if(this.config.localSource){
            this.initializeLocalFileSelector();
        }
    }


    /**
     * Creates required dom elements and appends in it
     * @return {[type]} [description]
     */
    initializeUIElements(){
        //Add the container class
        this.container.classList.add(this.config.containerClass);

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

        this.container.appendChild(this.mainVideoPlayerContainer); //Add the video tag inside the container
    }

    initializeVideoCallUI(){

        //Create panel container
        this.videoCallPanel = document.createElement("div");
        this.videoCallPanel.setAttribute("id","GWatch_camContainer");
        this.videoCallPanel.classList.add("disableResizer");

        //Create panel resizer
        this.videoCallPanelResizer = document.createElement("div");
        this.videoCallPanelResizer.setAttribute("id","GWatch_panResizer");

        //Create video broadcast button
        this.videoCallPanelStartBtn = document.createElement("button");
        this.videoCallPanelStartBtn.onclick = function(){ this.webRTC.startVideoCall(true) }.bind(this);
        this.videoCallPanelStartBtn.innerHTML = "Start Video";
        this.videoCallPanelStartBtn.classList.add(this.config.videoStartBtnClass);


        //Container for local and remote video tags
        this.videoCallPanelVideos = document.createElement("div");
        this.videoCallPanelVideos.classList.add("GWatch_camContainer_videos");
        

        //Create video tag for localstream
        this.videoCallPanelLocalStream = this.createVideoStreamHolder({
            id : "localVideo",
            autoplay : "",
        });
        this.videoCallPanelLocalStream.muted = "muted";

        //Create video tag for first remote stream
        this.videoCallPanelRemoteStream[0] = this.createVideoStreamHolder({
            id : "remoteVideo",
            autoplay : ""
        });

        //this.videoCallPanelRemoteStream[0].style.display = 'none';


        //Add all of the above to panel container
        if(!Utilities.config.disableVideo && Utilities.config.videoStartBtn){
            this.videoCallPanel.appendChild(this.videoCallPanelStartBtn);
        }

        if(!Utilities.config.disableVideo || !Utilities.config.disableChat){
            this.videoCallPanel.appendChild(this.videoCallPanelResizer);
        }

        if(!Utilities.config.disableVideo){

            this.videoCallPanelVideos.appendChild(this.videoCallPanelRemoteStream[0]);
            this.videoCallPanelVideos.appendChild(this.videoCallPanelLocalStream);
            this.videoCallPanel.appendChild(this.videoCallPanelVideos);

            //this.addTestVideoFrames();
        }           
        


        if(!Utilities.config.disableChat){
            this.makeChatUI();
            this.videoCallPanel.appendChild(this.chatContainer);
        }

        //Add the video panel to dom
        this.container.appendChild(this.videoCallPanel);
    }


    addTestVideoFrames(){

        //only for development purpose, should be removed
        for(var i=0; i < 10; i++){
            this.videoCallPanelLocalStream_x = this.createVideoStreamHolder({
                id : "localVideo"+Math.random()*10,
                autoplay : "",
            });            
            this.videoCallPanelVideos.appendChild(this.videoCallPanelLocalStream_x);
        }
    }


    /**
     * Makes UI interface for the chat room
     */
    makeChatUI(){

        //Chat box
        this.chatContainer = document.createElement("div");
        this.chatContainer.setAttribute("class","GWatch_chat_container");

        this.chatBox = document.createElement("div");
        this.chatBox.setAttribute("class","GWatch_chat_subcontainer");

        this.chatResizer = document.createElement("div");
        this.chatResizer.classList.add("GWatch_chat_resizer");

        this.chatBox.appendChild(this.chatResizer);

        this.chatBoxInput = document.createElement("input");
        this.chatBoxInput.setAttribute("class","GWatch_chatInput");
        this.chatBoxInput.setAttribute("type","text");
        this.chatBoxInput.setAttribute("placeholder","Type a message...");
        this.chatBoxInput.addEventListener("keyup", function(event) {
            if (event.key === "Enter") {
               this.sendChat(this.chatBoxInput.value);
            }
        }.bind(this));


        this.chatBoxPaper = document.createElement("div");
        this.chatBoxPaper.setAttribute("class",this.config.chatBoxPaperClass);

        //Chat box 
        this.chatBox.appendChild(this.chatBoxPaper);
        this.chatBox.appendChild(this.chatBoxInput);
        this.chatContainer.appendChild(this.chatBox);
    }


    openLocalFileSelector(){
        this.localFileSelector.click();
    }

    initializeLocalFileSelector(){

        this.localFileSelector = document.createElement("input");
        this.localFileSelector.setAttribute("type","file");
        this.localFileSelector.setAttribute("class","GWatch_localFileSeletor");

        this.localFileSelector.onchange = function(e){ this.onSrcSelected(e); }.bind(this);

        document.getElementById("GWatch_playerContainer").appendChild(this.localFileSelector);
    }


    createVideoStreamHolder(attrs){

        var videoHolder = document.createElement("video");

        videoHolder.classList.add("mirrored_video");

        for(var key in attrs){
            videoHolder.setAttribute(key,attrs[key]);
        }


        return videoHolder;
    }

    insertChat(message,styles){

        var chatMsgP = document.createElement("p");
        var chatMsg = document.createElement("span");

        chatMsg.innerHTML = message;

        for(var style in styles){
            chatMsgP.style[style] = styles[style];
        }


        chatMsgP.appendChild(chatMsg);

        var chatHolder = document.getElementsByClassName(Utilities.config.chatBoxPaperClass)[0];
        chatHolder.appendChild(chatMsgP);
        chatHolder.scrollTop = chatHolder.scrollHeight+50;
    }


    sendChat(message){

        this.insertChat(message,{
            'color': 'blue',
            'text-align': 'right'
        })

        this.chatBoxInput.value = "";

        //Send chat
        var socketPayload = {
            peerInfo : Utilities.config.peerInfo,
            name: Utilities.session_identifier,
            key: "chat",
            value : message
        };

        Utilities.log(socketPayload);

        Utilities.websocket.send(JSON.stringify(socketPayload)); 
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
            
            var offsetLeft = e.clientX;
            var offsetRight = container.width()-offsetLeft;

            if(offsetLeft > container.width() || offsetRight < 4){
                return ;
            }

            left.css('width', offsetLeft);
            right.css('width', offsetRight);
        }.bind(this)).on('mouseup', function (e) {
            // stop resizing
            this.isResizing = false;
        }.bind(this));
    }

    /**
     * Enable chat resizer
     */
    enableChatResizer(){

        this.isChatResizing = false,    
        this.lastChatDownY = 0;


        var container = $('#GWatch_camContainer'),
            up = $('.GWatch_camContainer_videos','#'+Utilities.config.container),
            down = $('.GWatch_chat_container','#'+Utilities.config.container),
            handle = $('.GWatch_chat_resizer','#'+Utilities.config.container);



        handle.on('mousedown', function (e) {
            this.isChatResizing = true;
            this.lastChatDownY = e.clientY;
            Utilities.log(this.lastChatDownY);
        }.bind(this));

        $(document).on('mousemove', function (e) {

            // we don't want to do anything if we aren't resizing.
            if (!this.isChatResizing) 
                return;
            
            var offsetUp  =  e.clientY;
            var offsetDown = container.height()-offsetUp;

            if(offsetDown > container.height()){
                return ;
            }

            up.css('height', offsetUp);
            down.css('height', offsetDown);
        }.bind(this)).on('mouseup', function (e) {
            // stop resizing
            this.isChatResizing = false;
        }.bind(this));
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
    changePlayerSource(newSrc,type){

        if(!type){ type = "video/mp4"; }

        //Dispatch the event
        this.container.dispatchEvent(new CustomEvent(Events.SRC_SELECTED,{detail:{src:newSrc,type:type}}));


        Utilities.log("Changing player's source");

        //Change src element
        this.container.getElementsByClassName(this.config.mainVideoPlayerSrcId)[0].setAttribute("src",newSrc);
        this.container.getElementsByClassName(this.config.mainVideoPlayerSrcId)[0].setAttribute("type",type);

        if(typeof Utilities.player=="undefined"){

            //Initialize video player
            Utilities.video = new VideoPlayer();
            Utilities.player = Utilities.video.player;

            //Expose the player 
            this.player = Utilities.player; 
        }else{

            //Video player already initialized
            //Change video player source
            Utilities.player.src({type:'video/mp4', src:newSrc});
            Utilities.player.load();
        }
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