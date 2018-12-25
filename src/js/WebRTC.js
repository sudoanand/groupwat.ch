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

 		this.peerConnection = [];
 		this.isNegotiating = [];

 		// if(navigator.mediaDevices.getUserMedia) {
 		// 	navigator.mediaDevices.getUserMedia(this.constraints).then(this.getUserMediaSuccess.bind(this)).catch(this.errorHandler);
 		// } else {
 		// 	alert('Your browser does not support getUserMedia API');
 		// }
 	}

 	getUserMediaSuccess(stream) {
 		//this.localStream = stream;
 		//this.localVideo.srcObject = stream;
 	}

 	requetVideo(){
		this.serverConnection.send(JSON.stringify({
				peerInfo : Utilities.config.peerInfo,
				'from' : Utilities.session_identifier,
				'type' : 'callRequest'
			}
		));
 	}

 	startVideoCall(isCaller,requestSignal) {

 		console.log("making pc:",requestSignal.from);

 		this.peerConnection[requestSignal.from] = new RTCPeerConnection(this.peerConnectionConfig);
 		this.peerConnection[requestSignal.from].onicecandidate = (event) => {
 			if(event.candidate != null) {    

				this.serverConnection.send(JSON.stringify({
					peerInfo : Utilities.config.peerInfo,
					'from':Utilities.session_identifier,
					'to': requestSignal.from,
					'ice': event.candidate, 
					'uuid': this.uuid
				}));
			}
 		}

 		this.peerConnection[requestSignal.from].ontrack = this.gotRemoteStream.bind(this);
 		//this.peerConnection[requestSignal.from].addStream(this.localStream);

 		this.isNegotiating[requestSignal.from] = false;
 		this.peerConnection[requestSignal.from].onnegotiationneeded = () => {



 			if (this.isNegotiating[requestSignal.from]) {
 				console.log(requestSignal);
			    console.log("SKIP nested negotiations");
			    return;
		    } 


 			this.isNegotiating[requestSignal.from] = true;

 			this.peerConnection[requestSignal.from].createOffer().then((description) =>{

 				Utilities.log('got local description');
				this.peerConnection[requestSignal.from].setLocalDescription(description).then(function() {

	 				//Send a call offer
					this.serverConnection.send(JSON.stringify({
						peerInfo : Utilities.config.peerInfo,
						'from': Utilities.session_identifier,
						'to' : requestSignal.from,
						'sdp': this.peerConnection[requestSignal.from].localDescription, 
						'uuid': this.uuid
					}));
				}.bind(this)).catch(this.errorHandler);
 			}).catch(this.errorHandler);
		}; 	


		this.peerConnection[requestSignal.from].onsignalingstatechange = (e) => {  // Workaround for Chrome: skip nested negotiations
		  this.isNegotiating[requestSignal.from] = (this.peerConnection[requestSignal.from].signalingState != "stable");
		}


		if(navigator.mediaDevices.getUserMedia) {
 			navigator.mediaDevices.getUserMedia(this.constraints).then((stream)=>{
 				stream.getTracks().forEach((track) =>
			      this.peerConnection[requestSignal.from].addTrack(track, stream));
			    this.localVideo.srcObject = stream;
 			}).catch(this.errorHandler);
 		} else {
 			alert('Your browser does not support getUserMedia API');
 		}		    		
 	}

 	gotMessageFromServer(message) {

		//Call the super method
		Utilities.mSocket.onMessage(message);
		var signal = JSON.parse(message.data);

		if(signal.type=="callRequest"){

			console.log("Got a call application from"+signal.from,signal);

			if(!this.peerConnection[signal.from]){
				this.startVideoCall(true,signal);
				console.log("Starting a call with: "+signal.from);
			}else{
				console.log("Not starting the call, already connected");
			}

		}
		else if(signal.sdp && signal.to == Utilities.session_identifier) {

			if(!this.peerConnection[signal.from]) this.startVideoCall(false,signal);

			this.peerConnection[signal.from].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(function() {
			  // Only create answers in response to offers
			  if(signal.sdp.type == 'offer') {

			  	console.log("Got an offer from "+signal.from,signal)

			  	this.peerConnection[signal.from].createAnswer().then((description) => {

			  		//The remove description  		
					this.peerConnection[signal.from].setLocalDescription(description).then(function() {
						this.serverConnection.send(JSON.stringify({
							peerInfo : Utilities.config.peerInfo,
							'from' : Utilities.session_identifier,
							'to' : signal.from,
							'sdp': this.peerConnection[signal.from].localDescription, 
							'uuid': this.uuid
						}));						
					}.bind(this)).catch(this.errorHandler);

			  	}).catch(this.errorHandler);
			  }else{
		
			  	console.log("Got an asnwer from "+signal.from);
		
			  }
			}.bind(this)).catch(this.errorHandler);
		} else if(signal.ice && signal.to == Utilities.session_identifier) {
		
			//console.log("Adding ice.candidate : ",signal);

			this.peerConnection[signal.from].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(this.errorHandler);
		}
	}


	gotRemoteStream(event) {
		if(event.track.kind!="video"){
			return;
		}

		console.log("Remote video found!!");
		//Create video tag for remote stream
        var videoCallPanelRemoteStream = Utilities.createVideoStreamHolder({
            class : "remoteVideo",
            autoplay : "",
        });

        videoCallPanelRemoteStream.muted = true;

		Utilities.log('got remote stream');
		videoCallPanelRemoteStream.srcObject = event.streams[0];
		videoCallPanelRemoteStream.style.height = "auto";

        //Add the holder into the DOM
        document.getElementsByClassName('GWatch_camContainer_videos')[0].appendChild(videoCallPanelRemoteStream);
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

