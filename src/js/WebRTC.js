/**
 * WebRTC.js
 * Controller class for the WebRTC audio/video/file transmission
 */

export class WebRTC{

	constructor(){
		console.log("good so far");

		this.peerConnectionConfig = {
		  'iceServers': [
		    {'urls': 'stun:stun.stunprotocol.org:3478'},
		    {'urls': 'stun:stun.l.google.com:19302'},
		  ]
		};

		this.uuid = this.createUUID();

		this.localVideo = document.getElementById('localVideo');
		this.remoteVideo = document.getElementById('remoteVideo');

		this.serverConnection = new WebSocket('wss://' + window.location.hostname + '/wss2/');
		//serverConnection = new WebSocket('wss://' + window.location.hostname + ':8443');
		this.serverConnection.onopen = function(){ console.log("socket connected!"); }
		this.serverConnection.onerror = function(){ console.error("socket error"); }
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
	  console.log("got local stream",stream);
	  this.localStream = stream;
	  this.localVideo.srcObject = stream;
	  this.start(true);
	}

	start(isCaller) {
	  this.peerConnection = new RTCPeerConnection(this.peerConnectionConfig);
	  this.peerConnection.onicecandidate = this.gotIceCandidate.bind(this);
	  this.peerConnection.ontrack = this.gotRemoteStream.bind(this);
	  this.peerConnection.addStream(this.localStream);

	  if(isCaller) {
	    this.peerConnection.createOffer().then(this.createdDescription.bind(this)).catch(this.errorHandler);
	  }
	}

	gotMessageFromServer(message) {

	  this.signal = JSON.parse(message.data);

	  if(signal.type){return false;}

	  if(!this.peerConnection) this.start(false);


	  if(signal.sdp) {
	    this.peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(function() {
	      // Only create answers in response to offers
	      if(signal.sdp.type == 'offer') {
	        this.peerConnection.createAnswer().then(this.createdDescription.bind(this)).catch(this.errorHandler);
	      }
	    }).catch(this.errorHandler);
	  } else if(signal.ice) {
	    console.log(message);
	    console.log("Adding : ",signal.ice.candidate);
	    this.peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice)).catch(this.errorHandler);
	  }
	}

	gotIceCandidate(event) {
	  if(event.candidate != null) {
	    console.log("ICE : ", event.candidate);
	    this.serverConnection.send(JSON.stringify({'ice': event.candidate, 'uuid': this.uuid}));
	  }
	}

	createdDescription(description) {
	  console.log('got description');

	  this.peerConnection.setLocalDescription(description).then(function() {
	    this.serverConnection.send(JSON.stringify({'sdp': this.peerConnection.localDescription, 'uuid': this.uuid}));
	  }).catch(this.errorHandler);
	}

	gotRemoteStream(event) {
	  console.log('got remote stream');
	  this.remoteVideo.srcObject = event.streams[0];
	}

	errorHandler(error) {
	  console.log(error);
	}

	// Taken from http://stackoverflow.com/a/105074/515584
	// Strictly speaking, it's not a real UUID, but it gets the job done here
	createUUID() {
	  function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	  }

	  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}
}

