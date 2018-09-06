<!DOCTYPE html>
<html>
<head>
  <link href="https://vjs.zencdn.net/7.1.0/video-js.css" rel="stylesheet">
  <link rel="stylesheet" type="text/css" href="assets/css/app.css">
</head>

<body>

  <center style="margin-top:50px">

    <video id="my-video"  class="video-js" controls preload="auto" width="640" height="264">
      <source id="my-video-src" src="" type='video/mp4'>
      <p class="vjs-no-js">
        To view this video please enable JavaScript, and consider upgrading to a web browser that
        <a href="https://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
      </p>
    </video>
    <input type="file" name="srcVideo" id="srcVideo">
    <div id="log"></div>
  </center>

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/video.js/7.2.1/video.min.js"></script>
  <script type="text/javascript" src="assets/js/socket.js"></script>
  <script type="text/javascript" src="assets/js/player.js"></script>
  <script type="text/javascript" src="assets/js/app.js"></script>
</body>
</html>