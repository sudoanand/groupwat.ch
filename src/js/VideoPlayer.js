/**
 * VideoPlayer
 * A controller class for the VideoJS player events
 * All the socket notifications are sent by this class
 * @author Ananad <@hack4mer> https://anand.today
 */
import videojs from 'video.js';
import {
    Utilities
} from './Utilities';
import VTTConverter from 'srt-webvtt';
/**
 * Constructor for the videoJS player controller
 */
export class VideoPlayer {
    constructor() {
        var options = {
            controlBar: {
                fullscreenToggle: false,
                allowFullscreen: false
            }            
        };

        options = Object.assign( {}, options, Utilities.config.playerOptions);
         


        this.fullscreenmode = false;
        this.lastSeekValue = 0;
        this.videoSeeking = 0;
        //Decides wether to send event notification to others through the socket   
        this.notifyPeers = true;
        //Initialize the videojs player
        this.player = videojs(Utilities.config.mainPlayerId, options, this.onPlayerReady.bind(this));
        this.containerEle = document.getElementById(Utilities.config.container);
        //Addig the modaldialog class prevents fullscreen on double click
        this.containerEle.getElementsByClassName("vjs-tech")[0].classList.add("vjs-modal-dialog");
        //Adds all the custom control buttons
        this.addAllControlBtns();
        //Fullscreen change event		
        //If videocalls are going on
        if (Utilities.config.videoCall) {
            ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "msfullscreenchange"].forEach(eventType => document.addEventListener(eventType, this.fullScreenChanged.bind(this), false));
        }
    }
    /**
     * Adds all custom btns 
     */
    addAllControlBtns() {
        //Add subtitle button
        this.subtitleBtn = this.addNewButton({
            "id": "addSubsBtn",
            "icon": "icon-speech",
            "title": "Add subtitle",
        }, this.onAddSubBtnClicked.bind(this));
        //Add subtitle button
        this.fullScreenBtn = this.addNewButton({
            "id": "fullScreenToogleBtn",
            "icon": "icon-size-fullscreen",
            "title": "Toggle fullscreen mode",
        }, this.toggleFullScreen.bind(this));
    }
    /**
     * Handles ecape click in fullscreen mode
     * @param  event e event object
     */
    fullScreenChanged(e) {
        var isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
        if (!isFullScreen) {
            this.switchedOffFullscreen();
        }
    }
    /**
     * Toggles the container to fullscreen
     */
    toggleFullScreen() {
        if (this.fullscreenmode) {
            this.exitFullscreenMode();
        } else {
            this.enterFullScreenMode();
        }
    }
    exitFullscreenMode() {
        //Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
        this.switchedOffFullscreen();
    }

    enterFullScreenMode() {
        //Enter fullscreen
        if (this.containerEle.requestFullscreen) {
            this.containerEle.requestFullscreen();
            this.switchedOnFullscreen();
        } else if (this.containerEle.mozRequestFullScreen) {
            this.containerEle.mozRequestFullScreen();
            this.switchedOnFullscreen();
        } else if (this.containerEle.webkitRequestFullscreen) {
            this.containerEle.webkitRequestFullscreen();
            this.switchedOnFullscreen();
        }
    }

    hideLocalFileSelector() {
        document.getElementsByClassName("GWatch_localFileSeletor")[0].style.display = "none";
    }
    showLocalFileSelector() {
        document.getElementsByClassName("GWatch_localFileSeletor")[0].style.display = "block";
    }
    /**
     * Performs post-nonfullscreenmode task
     */
    switchedOffFullscreen() {
        this.fullscreenmode = false;
        this.containerEle.classList.remove("fullscreen_vidjs");
        if (Utilities.config.localSource) {
            this.showLocalFileSelector();
        }
        if (Utilities.config.videoCall) {
            //Resize to default sizes on screen changes
            document.getElementById("GWatch_playerContainer").style.width = "100%";
            var camContainer = document.getElementById("GWatch_camContainer");
            camContainer.style.width = "20%";
            camContainer.classList.add("disableResizer");
        }

        this.containerEle.dispatchEvent(new CustomEvent(Utilities.events.EXIT_FULL_SCREEN));        
    }
    /**
     * Performs post-fullscreenmode tasks
     */
    switchedOnFullscreen() {
        this.fullscreenmode = true;
        this.containerEle.classList.add("fullscreen_vidjs");
        if (Utilities.config.localSource) {
            this.hideLocalFileSelector();
        }
        if (Utilities.config.videoCall) {
            //Resize to default sizes on screen changes		
            document.getElementById("GWatch_playerContainer").style.width = "80%";
            var camContainer = document.getElementById("GWatch_camContainer");
            camContainer.style.width = "20%";
            camContainer.classList.remove("disableResizer");
        }

        this.containerEle.dispatchEvent(new CustomEvent(Utilities.events.ENTER_FULL_SCREEN));
    }
    /**
     * Adds new button to the player
     * @param {object} data an object with valid keys : icon,id,title
     * @param {function} onClickListener A click listener for the added button
     */
    addNewButton(data, onClickListener) {
        var myPlayer = this.player,
            controlBar,
            insertBeforeNode,
            newElement = document.createElement('div'),
            newLink = document.createElement('a');
        newElement.id = data.id;
        newElement.className = 'vjs-custom-icon vjs-control';
        newLink.innerHTML = "<i title='" + data.title + "' class='icon " + data.icon + " line-height' aria-hidden='true'></i>";
        newElement.appendChild(newLink);
        controlBar = this.containerEle.getElementsByClassName('vjs-control-bar')[0];
        insertBeforeNode = this.containerEle.getElementsByClassName('vjs-fullscreen-control')[0];
        controlBar.insertBefore(newElement, insertBeforeNode);
        if (typeof onClickListener != "undefined") {
            newElement.onclick = onClickListener; //Add the click listener
        }
        return newElement;
    }
    /**
     * Handles click event for the "Add subtitle button"
     * @return {[type]} [description]
     */
    onAddSubBtnClicked() {
        var tempFileInput = $('<input/>').attr('type', 'file').attr('accept', '.vtt,.srt');
        tempFileInput.change(this.onSubChanged.bind(this));
        //Open the file dialog to select subtitle
        tempFileInput.trigger('click');
    }
    /**
     * Handles the event of a subtitle being changed or added
     * @param {event} e  jQuery event object
     */
    onSubChanged(e) {
        var file = e.target.files[0],
            fileExt = file.name.slice(-3),
            fileUrl;
        //Convert to .vtt if the selected file is .srt
        if (fileExt == "srt") {
            //a .srt file is selected
            //covert it and enable it
            this.setSrtSubtitle(file);
        } else if (fileExt == "vtt") {
            //.vtt is selected, no coversion required
            fileUrl = window.URL.createObjectURL(file),
                this.setSubtitle(fileUrl);
        } else {
            Utilities.notifyError("Only .srt and .vtt files are supported as subtitles");
        }
    }
    /**
     * Sets a given ur as the subtitle of the playing video, removes old ones
     * @param {string} url remote url to be used as source for the subtitle
     */
    setSubtitle(fileUrl) {
        //Remove old tracks
        var oldTracks = this.player.remoteTextTracks();
        var i = oldTracks.length;
        while (i--) {
            this.player.removeRemoteTextTrack(oldTracks[i]);
        }
        //Add the track to the player
        this.player.addRemoteTextTrack({
            src: fileUrl,
            kind: 'captions',
            label: 'captions on'
        })
        //enable the current subtitle
        this.player.remoteTextTracks()[0].mode = 'showing';
    }
    /**
     * converts a .srt subtitle file to .vtt file and activates it 
     * @param  {file} file selected subtitle file
     */
    setSrtSubtitle(file) {
        var _ = this;
        const vttConverter = new VTTConverter(file);
        vttConverter.getURL().then(function(url) {
            //.vtt generated      
            //Enable the subtitles
            _.setSubtitle(url);
        }).catch(function(err) {
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
        this.player.on("seeking", function(e) {
            this.videoSeeking = true;
            Utilities.log("Video seeking: " + this.player.currentTime());
        }.bind(this));
        //Video pause event handler
        this.player.on('pause', function(e) {
            var socketPayload = {
                roomId: Utilities.roomId,
                name: Utilities.session_identifier,
                key: "pause",
                value: true
            };
            if (this.notifyPeers) {
                //Notify peers
                Utilities.log("Video paused", "Sending socket message");
                Utilities.log(socketPayload)
                Utilities.websocket.send(JSON.stringify(socketPayload));
            }
            //Remove the notification lock, if present
            this.notifyPeers = true;
        }.bind(this));
        //Video play event handler
        this.player.one('play',function(){            
            Utilities.container.dispatchEvent(new CustomEvent(Utilities.events.FIRST_VIDEO_PLAY));            
        })
        this.player.on('play', function() {
            if (this.videoSeeking) {
                return;
            }
            Utilities.container.dispatchEvent(new CustomEvent(Utilities.events.VIDEO_PLAYED));
            var socketPayload = {
                roomId: Utilities.roomId,
                name: Utilities.session_identifier,
                key: "play",
                value: true
            };
            if (this.notifyPeers) {
                //Notify peers
                Utilities.log("Video played", "Sending socket message");
                Utilities.log(socketPayload)
                Utilities.websocket.send(JSON.stringify(socketPayload));
            }
            //Remove the notification lock, if present
            this.notifyPeers = true;
        }.bind(this));
        //Video seeke happened event handler
        this.player.on("seeked", function(e) {
            this.videoSeeking = false;
            var seekedTo = this.player.currentTime();
            if (seekedTo == this.lastSeekValue) {
                return;
            }
            Utilities.log("Video seeked");
            var socketPayload = {
                roomId: Utilities.roomId,
                name: Utilities.session_identifier,
                key: "seek_value",
                value: {
                    time: seekedTo,
                    play: !this.player.paused()
                }
            };
            this.lastSeekValue = seekedTo;
            if (this.notifyPeers) {
                //Notify peers
                Utilities.log("Sending seeked singal message");
                Utilities.log(socketPayload)
                Utilities.websocket.send(JSON.stringify(socketPayload));
            }
            //Remove the notification lock, if present
            this.notifyPeers = true;
        }.bind(this));
    }
}