/**
 * Socket.js
 * A controller for the WebSocket events and communications for the video player 
 * @author Anand Singh <@hack4mer> https://anand.today
 */
import $ from 'jquery';
import {
    Utilities
} from './Utilities'
/**
 * socket constructor
 * @param  {string} SOCKET_SERVER Hostname of the socket server
 */
export const Socket = function(socket_server) {
    this.wsUri = socket_server;
    this.websocket = new WebSocket(this.wsUri);
    this.websocket.onopen = function() {
        this.socketConnected();
        Utilities.onSocketConnected.bind(this);
    }.bind(this);

    this.websocket.onmessage = this.onMessage;
    this.websocket.onerror = Utilities.onSocketError.bind(this);
    this.websocket.onclose = Utilities.onSocketError.bind(this);

    this.notificationAudio = new Audio('https://dsmbdpe1u2kpu.cloudfront.net/wp-content/uploads/20181001182143/to-the-point.mp3');
}


Socket.prototype.playNotificationSound = function() {
    this.notificationAudio.play();
}


Socket.prototype.socketConnected = function() {
    
    Utilities.container.dispatchEvent(new CustomEvent(Utilities.events.SOCKET_CONNECTED));

    var socketPayload = {
        key: "connection",
        value: Utilities.config.peerInfo
    };
    Utilities.websocket.send(JSON.stringify(socketPayload));
}


Socket.prototype.onMessage = function(ev) {
    var response = JSON.parse(ev.data); //Server sends Json string
    if (response.key == "chat") {
        this.gotChat(response);
    } else if (response.key == "connection") {

        Utilities.container.dispatchEvent(new CustomEvent(Utilities.events.PEER_JOINED,{detail:response.value}));
    } else {
        if (!Utilities.video) {
            //Video has not been initialized yet       
            return;
        }
        //Do not notify others about this player event since it was triggered by someone else
        Utilities.video.notifyPeers = false;
        Utilities.log("Socket message received:", Utilities.video.notifyPeers);
        Utilities.log(response);
        if (response.key == "seek_value") {
            Utilities.player.currentTime(response.value.time); //Seek the video
            if (response.value.play) {
                Utilities.player.play(); //Play if the peers video is playing
            }
        } else if (response.key == "pause" && !Utilities.player.paused()) {
            //Pause the video as requested by the peer
            Utilities.player.pause();
        } else if (response.key == "play" && Utilities.player.paused()) {
            //Play the video as requested by the peer
            Utilities.player.play();
        } else {
            //Remove the notification lock
            Utilities.video.notifyPeers = true;
        }
    }
};


Socket.prototype.gotChat = function(response) {
    Utilities.log(response);
    var chatMsgP = document.createElement("p");
    var chatMsg = document.createElement("span");
    chatMsg.innerHTML = response.value
    chatMsg.style.color = "red";
    chatMsg.style['text-align'] = "left";
    chatMsgP.appendChild(chatMsg);
    var chatHolder = document.getElementsByClassName(Utilities.config.chatBoxPaperClass)[0];
    chatHolder.appendChild(chatMsgP);
    chatHolder.scrollTop = chatHolder.scrollHeight;
    this.playNotificationSound();
}


/**
 * Socket connection error handler
 * @param  {event} ev event object 
 */
Socket.prototype.onError = Utilities.onSocketError