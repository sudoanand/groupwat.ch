<html>
    <head>
    </head>

    <body>
        <video id="localVideo" autoplay muted style="width:40%;"></video>
        <video id="remoteVideo" autoplay style="width:40%;"></video>

        <br />

        <input type="button" id="start" onclick="start(true)" value="Start Video"></input>



        <script type="text/javascript">
            
            var localVideo;
            var remoteVideo;
            var peerConnection;
            var peerConnectionConfig = {'iceServers': [{'url': 'stun:stun.services.mozilla.com'}, {'url': 'stun:stun.l.google.com:19302'}]};

            navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
            window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
            window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
            window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;

            function pageReady() {
                localVideo = document.getElementById('localVideo');
                remoteVideo = document.getElementById('remoteVideo');

                console.log("connecting socket");

                serverConnection = new WebSocket('wss://localhost/wss2/');
                serverConnection.onmessage = gotMessageFromServer;
                serverConnection.onopen = function(){console.log("socket connected");}
                serverConnection.onerror = function(){console.error("socket error");}

                var constraints = {
                    video: true,
                    audio: true,
                };

                if(navigator.getUserMedia) {
                    navigator.getUserMedia(constraints, getUserMediaSuccess, getUserMediaError);
                } else {
                    alert('Your browser does not support getUserMedia API');
                }
            }

            function getUserMediaSuccess(stream) {
                localStream = stream;
                localVideo.src = window.URL.createObjectURL(stream);
            }

            function getUserMediaError(error) {
                console.log(error);
            }

            function start(isCaller) {
                peerConnection = new RTCPeerConnection(peerConnectionConfig);
                peerConnection.onicecandidate = gotIceCandidate;
                peerConnection.onaddstream = gotRemoteStream;
                peerConnection.addStream(localStream);

                if(isCaller) {
                    peerConnection.createOffer(gotDescription, createOfferError);
                }
            }

            function gotDescription(description) {
                console.log('got description');
                peerConnection.setLocalDescription(description, function () {
                    serverConnection.send(JSON.stringify({'sdp': description}));
                }, function() {console.log('set description error')});
            }

            function gotIceCandidate(event) {
                if(event.candidate != null) {
                    serverConnection.send(JSON.stringify({'ice': event.candidate}));
                }
            }

            function gotRemoteStream(event) {
                console.log('got remote stream');
                remoteVideo.src = window.URL.createObjectURL(event.stream);
            }

            function createOfferError(error) {
                console.log(error);
            }

            function gotMessageFromServer(message) {                   

                if(!message.data){ return ;}
                
                var signal = JSON.parse(message.data);

                if(signal.type=="system"){ return ;}

                if(!peerConnection) start(false);

                if(signal.sdp) {
                    peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp), function() {
                        if(signal.sdp.type == 'offer') {
                            peerConnection.createAnswer(gotDescription, createAnswerError);
                        }
                    });
                } else if(signal.ice) {
                    peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice));
                }
            }

        </script>

        <script type="text/javascript">
            pageReady();
        </script>

    </body>
</html>
