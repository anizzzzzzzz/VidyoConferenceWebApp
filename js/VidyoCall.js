function JoinCall(vidyoConnector){
    vidyoConnector.Connect({
       host: "prod.vidyo.io",
       token: localStorage.token,
       displayName: localStorage.displayName,
       resourceId: localStorage.roomId,
       // Define handlers for connection events.
       onSuccess: function()            {/* Connected */},
       onFailure: function(reason)      {/* Failed */},
       onDisconnected: function(reason) {/* Disconnected */}
       }).then(function(status) {
           if (status) {
               // Remove Preview Span
                let displayNameSpan = $('span.video-display-name');
                if(displayNameSpan.text() === 'Preview'){
                    displayNameSpan.css('display','none');
                }

               console.log("ConnectCall Success");
               $('.call-button span').addClass('icon-call-off').removeClass('icon-call-on');
               $('.call-button').attr('disabled',false);
               $('.screen-share-button').attr('disabled', false);
               $('span#connection_status_text').text("Connected");
               $('span#connection_status_text').css('color','green');
           } else {
               console.error("ConnectCall Failed");
               $('.call-button span').removeClass('icon-call-off').addClass('icon-call-on');
               $('span#connection_status_text').text("Failed to connect.");
               $('span#connection_status_text').css('color','red');
           }
       }).catch(function() {
           console.error("ConnectCall Failed");
           $('span#connection_status_text').text("Failed to connect.");
           $('span#connection_status_text').css('color','red');
       });
}

// Call Button
function callButtonClick(){
    let status = $('.call-button').attr('data-status') === 'on';
    let newStatus = status?'off':'on';

    if(status){
        vidyoConnector.Disconnect().then(function() {
            $('.call-button span').removeClass('icon-call-off').addClass('icon-call-on');
            $('span#connection_status_text').text("Disconnected. Ready to call.");
            $('span#connection_status_text').css('color','red');
        }).catch(function() {
            console.error("Disconnect Failure");
        });
    }
    else{
        JoinCall(vidyoConnector);
    }
    $('.call-button').attr('data-status', newStatus);
}

// Mute Button
function muteButtonClick(){
    let status = $('.mute-button').attr('data-status')=== 'on';
    let newStatus = status?'off':'on';

    vidyoConnector.SetMicrophonePrivacy({
        privacy: status
    }).then(function() {
        if (status) {
            $('.mute-button span').addClass('icon-mute-off').removeClass('icon-mute-on');
        } else {
            $('.mute-button span').removeClass('icon-mute-off').addClass('icon-mute-on');
        }
        $('.mute-button').attr('data-status', newStatus);
        console.log("SetMicrophonePrivacy Success");
    }).catch(function() {
        console.error("SetMicrophonePrivacy Failed");
    });
}

// Camera Button
function cameraButtonClick(){
    let status = $('.camera-button').attr('data-status') === 'on';
    let newStatus = status?'off':'on';

    vidyoConnector.SetCameraPrivacy({
        privacy: status
    }).then(function() {
        if (status) {
            $('.camera-button span').removeClass('icon-camera-off').addClass('icon-camera-on');
        } else {
            $('.camera-button span').addClass('icon-camera-off').removeClass('icon-camera-on');
        }
        $('.camera-button').attr('data-status', newStatus);
        console.log("SetCameraPrivacy Success");
    }).catch(function() {
        console.error("SetCameraPrivacy Failed");
    });
}

function participantsButtonClick(){
    let status = $('.participants-button').attr('data-status') === 'on';
    let newStatus = status?'off':'on';
    if(!status){
        $('div.video-section').css('width', '80%');
        $('div.chat-section').css('width', '20%');
        $('div.chat-section').css('display', 'block');
        $('div.chat-section .chat-div').css('display','none');
        $('div.chat-section .participants-div').css('display','block');
    }
    else{
        $('div.video-section').css('width', '100%');
        $('div.chat-section').css('width', '0');
        $('div.chat-section').css('display', 'none');
        $('div.chat-section .chat-div').css('display','none');
        $('div.chat-section .participants-div').css('display','none');
    }
    $('.participants-button').attr('data-status', newStatus);
    $('.chat-button').attr('data-status', !newStatus);
}

function chatButtonClick(){
    let status = $('.chat-button').attr('data-status') === 'on';
    let newStatus = status?'off':'on';
    
    if(!status){
        $('div.video-section').css('width', '80%');
        $('div.chat-section').css('width', '20%');
        $('div.chat-section').css('display', 'block');
        $('div.chat-section .chat-div').css('display','block');
        $('div.chat-section .participants-div').css('display','none');

        $("#new-message-notification").addClass("hidden").text('');
        chatData.numMissedMessages = 0;
        updateScroll();
    }
    else{
        $('div.video-section').css('width', '100%');
        $('div.chat-section').css('width', '0');
        $('div.chat-section').css('display', 'none');
        $('div.chat-section .chat-div').css('display','none');
        $('div.chat-section .participants-div').css('display','none');
    }
    $('.chat-button').attr('data-status', newStatus);
    $('.participants-button').attr('data-status', !newStatus);
}