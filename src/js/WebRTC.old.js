/**
 * WebRTC.js
 * Controller class for the WebRTC audio/video/file transmission
 */
import {Utilities} from './Utilities'

export class WebRTC{

	constructor(){
	
		this.peerConnectionConfig = {
		  'iceServers': [
		    {'urls': 'stun:stun.stunprotocol.org:3478'},
		    {'urls': 'stun:stun.l.google.com:19302'},
		  ]
		};

		this.uuid = Utilities.uuid;

		this.localVideo = document.getElementById('localVideo');
		this.remoteVideo = document.getElementById('remoteVideo');

		this.serverConnection = Utilities.websocket;
		this.serverConnection.onmessage = this.gotMessageFromServer.bind(this);

		this.constraints = {
		video: true,
		audio: true
		};

		if(navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices.getUserMedia(this.constraints).then(this.getUserMediaSuccess.bind(this)).catch(this.errorHandler);
		} else {
		alert('Your browser does not support getUserMedia API');
		}
	}

	getUserMediaSuccess(stream) {
	  this.localStream = stream;
	  this.localVideo.srcObject = stream;
	}

	startVideoCall(isCaller) {
	  this.peerConnection = new RTCPeerConnection(this.peerConnectionConfig);
	  this.peerConnection.onicecandidate = this.gotIceCandidate.bind(this);
	  this.peerConnection.ontrack = this.gotRemoteStream.bind(this);
	  this.peerConnection.addStream(this.localStream);

	  if(isCaller) {
	    this.peerConnection.createOffer().then(this.createdDescription.bind(this)).catch(this.errorHandler);
	  }
	}

	gotMessageFromServer(message) {

		//Call the super method
		Utilities.mSocket.onMessage(message);


		var signal = JSON.parse(message.data);

		if(!this.peerConnection) this.startVideoCall(false);


		if(signal.sdp) {
			this.peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(function() {
			  // Only create answers in response to offers
			  if(signal.sdp.type == 'offer') {
			    this.peerConnection.createAnswer().then(this.createdDescription.bind(this)).catch(this.errorHandler);
			  }
			}.bind(this)).catch(this.errorHandler);
		} else if(signal.ice) {
			Utilities.log(message);
			Utilities.log("Adding : ",signal.ice.candidate);

			this.peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice)).catch(this.errorHandler);
		}
	}

	gotIceCandidate(event) {
	  if(event.candidate != null) {
	    this.serverConnection.send(JSON.stringify({'roomId': Utilities.roomId,'ice': event.candidate, 'uuid': this.uuid}));
	  }
	}

	createdDescription(description) {
	  Utilities.log('got description');

	  this.peerConnection.setLocalDescription(description).then(function() {
	    this.serverConnection.send(JSON.stringify({'roomId': Utilities.roomId,'sdp': this.peerConnection.localDescription, 'uuid': this.uuid}));
	  }.bind(this)).catch(this.errorHandler);
	}

	gotRemoteStream(event) {
	  Utilities.log('got remote stream');
	  this.remoteVideo.srcObject = event.streams[0];
	  this.remoteVideo.style.height = "auto";
	}

	errorHandler(error) {
	  console.error(error);
	}

	/**
	 * Pause the audio and video streaming
	 */
	pauseVideoCall(){
		this.pauseVideo();
		this.pauseAudio();
	}

	/**
	 * Pause just the video 
	 */
	pauseVideo(){
		this.localStream.getVideoTracks()[0].enabled = false;
	}

	/**
	 * Pause just the audio streaming
	 */
	pauseAudio(){
		this.localStream.getAudioTracks()[0].enabled = false;
	}

	/**
	 * Resume audio and video streaming
	 */
	resumeVideoCall(){
		this.resumeVideo();
		this.resumeAudio();
	}

	/**
	 * Resume just the video streaming
	 * @return {[type]} [description]
	 */
	resumeVideo(){
		this.localStream.getVideoTracks()[0].enabled = true;
	}

	/**
	 * Resume the audio streaming
	 */
	resumeAudio(){
		this.localStream.getAudioTracks()[0].enabled = true;
	}
}

