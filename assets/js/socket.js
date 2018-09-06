const SOCKET_SERVER = window.location.hostname;


//create a new WebSocket object.
var msgBox = $('#log');
var wsUri = "ws://"+SOCKET_SERVER+":12345/server.php";  
websocket = new WebSocket(wsUri); 



websocket.onopen = function(ev) { // connection is open 
  msgBox.append('<div class="system_msg" style="color:#bbbbbb">Welcome to my "Demo WebSocket Chat box"!</div>'); //notify user
}

// Message received from server
websocket.onmessage = function(ev){
  var response    = JSON.parse(ev.data); //PHP sends Json data
 
  console.log(response); 

  if(response.key=="seek_value"){
    player.currentTime(response.value);
    player.play();
    lastSeekValue = response.value;
  }

  if(response.key=="pause"){
    player.pause("andy");
  }

  if(response.key=="play"){
    player.play();
  }
};

websocket.onerror = function(ev){ msgBox.append('<div class="system_error">Error Occurred - ' + ev.data + '</div>'); }; 
websocket.onclose   = function(ev){ msgBox.append('<div class="system_msg">Connection Closed</div>'); }; 

//Message send button
$('#send-message').click(function(){
  send_message();
});

//User hits enter key 
$( "#message" ).on( "keydown", function( event ) {
  if(event.which==13){
    send_message();
  }
});

//Send message
function send_message(){
  var message_input = $('#message'); //user message text
  var name_input = $('#name'); //user name
  
  if(message_input.val() == ""){ //empty name?
    alert("Enter your Name please!");
    return;
  }
  if(message_input.val() == ""){ //emtpy message?
    alert("Enter Some message Please!");
    return;
  }

  //prepare json data
  var msg = {
    message: message_input.val(),
    name: name_input.val(),
    color : '#000'
  };
  //convert and send data to server
  websocket.send(JSON.stringify(msg));  
  message_input.val(''); //reset message input
}