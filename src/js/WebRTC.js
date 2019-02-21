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

		if(navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices.getUserMedia(this.constraints).then(this.getUserMediaSuccess.bind(this)).catch(this.errorHandler);
		} else {
			alert('Your browser does not support getUserMedia API');
		}

		//Register user left notifier
		window.addEventListener('beforeunload', function () {
			this.leavingRoom();
		}.bind(this), false);
		
	 }
	 
	leavingRoom(){
		this.serverConnection.send(JSON.stringify({
			peerInfo : Utilities.config.peerInfo,
			'from' : Utilities.session_identifier,
			'type' : 'bye'
		}));
	}

 	getUserMediaSuccess(stream) {
 		this.localVideo.srcObject = stream;
 	}

	//New joiners make a video request
 	requestVideo(){
		this.serverConnection.send(JSON.stringify({
				peerInfo : Utilities.config.peerInfo,
				'from' : Utilities.session_identifier,
				'type' : 'callRequest'
			}
		));
 	}

	//Already connected peers startVideoCall with the new joiner as response to his requestVideo
 	async startVideoCall(isCaller,requestSignal) {

        Utilities.log("making pc:",requestSignal.from);
        
        this.peerConnection[requestSignal.from] = new RTCPeerConnection(this.peerConnectionConfig);
        var peerFrom = this.peerConnection[requestSignal.from];
 		peerFrom.onicecandidate = (event) => {
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
		
 		peerFrom.ontrack = (event) => {
			if(event.track.kind!="video"){
				return;
			}
	
			Utilities.log("Remote video found!!");
			//Create video tag for remote stream
			var videoCallPanelRemoteStream = Utilities.createVideoStreamHolder({
				class : "remoteVideo",
				id:requestSignal.from,
				autoplay : "",
			});
		
			Utilities.log('got remote stream');
			videoCallPanelRemoteStream.srcObject = event.streams[0];
			videoCallPanelRemoteStream.style.height = "auto";
	
            //Add the holder into the DOM
            var videoCallPanelRemoteStreamContainer = document.createElement("div");
            var videoCallPanelRemoteStreamFooter = document.createElement("div");

            //Mute btn
            var muteBtn = document.createElement("i");
            muteBtn.classList.add("fa");
            muteBtn.classList.add("fa-microphone-slash");
            muteBtn.onclick = () => {
                if(muteBtn.classList.contains("active")){

                    muteBtn.classList.remove("active");
                    videoCallPanelRemoteStream.muted= false;
                    return;
                }
                muteBtn.classList.add("active");
                videoCallPanelRemoteStream.muted = true;
            }

            //Adding some classes
            videoCallPanelRemoteStreamContainer.classList.add("remoteVideoContainer");
            videoCallPanelRemoteStreamFooter.classList.add("remoteVideoFooter");
            
            //Append
            videoCallPanelRemoteStreamContainer.appendChild(videoCallPanelRemoteStream);
            videoCallPanelRemoteStreamFooter.appendChild(muteBtn);
            videoCallPanelRemoteStreamContainer.appendChild(videoCallPanelRemoteStreamFooter);


			document.getElementsByClassName('GWatch_camContainer_videos')[0].appendChild(videoCallPanelRemoteStreamContainer);
			Utilities.container.dispatchEvent(new CustomEvent(Utilities.events.GOT_REMOTE_VIDEO,{detail:event}));
		}

		this.peerConnection[requestSignal.from].onsignalingstatechange = (e) => {  // Workaround for Chrome: skip nested negotiations
		  this.isNegotiating[requestSignal.from] = (this.peerConnection[requestSignal.from].signalingState != "stable");
		}


        //Add the track to be sent
        var stream = this.localVideo.srcObject;
        stream.getTracks().forEach((track) => { this.peerConnection[requestSignal.from].addTrack(track, stream); });
         
        //Create offer when needed
        this.isNegotiating[requestSignal.from] = false;
 		peerFrom.onnegotiationneeded = async () => {

            if(!isCaller){
                return;
            }

            Utilities.log("I need it",window.theRemoteDesc);

 			if (this.isNegotiating[requestSignal.from]) {
 				Utilities.log(requestSignal);
			    Utilities.log("SKIP nested negotiations");
			    return;
		    } 


 			this.isNegotiating[requestSignal.from] = true;


 			var description = await peerFrom.createOffer();

            Utilities.log('got local description');
            Utilities.log("a",isCaller,requestSignal);
                       
            await peerFrom.setLocalDescription(description); 
            Utilities.log("b");
            
            //if(isCaller){
            Utilities.log('Making offer');
            //Send a call offer
            this.serverConnection.send(JSON.stringify({
                peerInfo : Utilities.config.peerInfo,
                'from': Utilities.session_identifier,
                'to' : requestSignal.from,
                'sdp': this.peerConnection[requestSignal.from].localDescription, 
                'uuid': this.uuid
            }));
            //}
				 			
		}; 	
 	}



 	gotMessageFromServer(message) {
		//Call the super method
		Utilities.mSocket.onMessage(message);
		var signal = JSON.parse(message.data);

		if(signal.type=="bye"){

			//Remove leaving peers video from the DOM
			var remoteVideoHolerForLeavingPeer = document.getElementById(signal.from);
			remoteVideoHolerForLeavingPeer.parentNode.removeChild(remoteVideoHolerForLeavingPeer);

			Utilities.container.dispatchEvent(new CustomEvent(Utilities.events.PEER_LEFT,{detail:signal}));

		}else if(signal.type=="callRequest"){

			Utilities.log("Got a call application from"+signal.from,signal);

			if(!this.peerConnection[signal.from]){
				this.startVideoCall(true,signal);
				Utilities.log("Starting a call with: "+signal.from);
			}else{
				Utilities.log("Not starting the call, already connected");
			}

		}
		else if(signal.sdp && signal.to == Utilities.session_identifier) {

			if(!this.peerConnection[signal.from]) this.startVideoCall(false,signal);

			this.peerConnection[signal.from].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(function() {
			  // Only create answers in response to offers
			  if(signal.sdp.type == 'offer') {
                
                Utilities.log("Got an offer from "+signal.from,signal)

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
                Utilities.log("Got an asnwer from "+signal.from);		
              }
              
			}.bind(this)).catch(this.errorHandler);
		} else if(signal.ice && signal.to == Utilities.session_identifier) {
		
			//Utilities.log("Adding ice.candidate : ",signal);
			this.peerConnection[signal.from].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(this.errorHandler);
		}
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

