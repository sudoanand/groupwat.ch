/**
 * Gwatch
 * A controller class for the vidoe player and index page functionalities
 * @author Anand Singh <@hack4mer> https://anand.today
 */
import {VideoPlayer} from './VideoPlayer'
import $ from 'jquery';
import {Socket} from './Socket'


/**
 * GWatch constructor
 * @param {object} options configuration object for the GroupWat.ch player
 */
export const GWatch = function(options){

    //options and config
    this.config = {
    	videoId :  options.videoId || 'my-video',
        videoSelector : options.videoSelector || $("#video-selector"),
        videoSrcElement : options.videoSrcElement || $("#my-video-src"),
        devmode : options.devmode || false,
        socket_server : options.socket_server || window.location.hostname,
        socket_port : options.socket_port ||12345
    };

    //A unique identifier for the socket connection    
    this.session_identifier = this.generateConnectionId();

    //A placeholder for an instance of the VideoPlayer
    this.video = null;

    //show the video player
    $("#my-video").show();


    //Attach jQuery UI events to the dom elements
    this.initializeUIEvents();        

    //Initialize the socket class
    this.socket = new Socket(this.config.socket_server,this.config.socket_port);
}

/**
 * Simple method to log debug messages with a predefined tag
 */
GWatch.prototype.log = function(){

    if(!this.config.devmode) { return; } //Disabled when not in devmode

    console.log("GWatch: ",[].slice.call(arguments).join(","));
}

/**
 * Initializes jQuery events to the DOM elements
 */
GWatch.prototype.initializeUIEvents = function(){

    this.log("Initializing UI events");

    //on video src change
    this.config.videoSelector.change(this.onSrcSelected.bind(this));
}


/**
 * Event handler for the change in video selector input file 
 */
GWatch.prototype.onSrcSelected = function(e){

    var _       = this,
        file    = e.target.files[0],
        fileUrl = window.URL.createObjectURL(file);

    _.log("New source file selected");

    //Configure the player to use newly selected source
    _.changePlayerSource(fileUrl)

    //Hide video selector
    //_.config.videoSelector.hide();
}

/**
 * Changes video source and configures the player to use it
 * @param  {string} newSrc the new video source to be applied
 */
GWatch.prototype.changePlayerSource = function(newSrc){

    this.log("Changing player's source");

    //Change src element
    this.config.videoSrcElement.attr("src",newSrc);

    if(typeof this.player=="undefined"){

    	//Initialize video player
        this.video = new VideoPlayer();
    	this.player = this.video.player;
    }else{

    	//Video player already initialized
    	//Change video player source
    	this.player.src({type:'video/mp4', src:newSrc});
    	this.player.load();
    	this.player.play();
    }
}

/**
 * Generates a random string to use as an identifier for the socket connection
 * @return {[type]} [description]
 */
GWatch.prototype.generateConnectionId = function(){
  var date = new Date();
  return btoa(unescape(encodeURIComponent(date.getTime()+Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)))).slice(0,-2);
}

