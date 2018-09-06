$(function() {

    $("#srcVideo").change(function(){

        var src = window.URL.createObjectURL(this.files[0]);
        $("#my-video-src").attr("src",src);
        VideoPlayer();
        $("#my-video").show();
        $("#srcVideo").hide();
        console.log(src);
    });
});

lastSeekValue = false;
videoSeeking  = false;
