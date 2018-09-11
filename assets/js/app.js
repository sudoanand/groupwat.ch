/**
 * Gwatch
 * A controller for vidoe player
 * @author Anand Singh <@hack4mer> https://anand.today
 */
var GWatch = function(options) {


    //options and config
    this.config = {
        videoSelector : options.videoSelector || $("#video-selector"),
        videoSrcElement : options.videoSrcElement || $("#my-video-src"),
        devmode : options.devmode || false
    };

    
    //show the video player
    $("#my-video").show();


    //Attach jQuery UI events to the dom elements
    this.initializeUIEvents();
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

    var _       = this;
        file    = e.target.files[0],
        fileUrl = window.URL.createObjectURL(file);

    _.log("Src file selected","URL : "+fileUrl);

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

    this.log("Changing player's source",newSrc);

    //Change src element
    this.config.videoSrcElement.attr("src",newSrc);

    //Re-initilize the video player to use the new source
    this.reinitializeVideoPlayer();
}


/**
 * Initiazlizes the videojs player 
 * Disposes the old player , if any
 */
GWatch.prototype.reinitializeVideoPlayer = function(){

   
    this.video = new VideoPlayer();
   
}






