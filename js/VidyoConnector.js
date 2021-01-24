function ShowRenderer(vidyoConnector) {
    var rndr = document.getElementById('renderer');
    vidyoConnector.ShowViewAt({viewId: "renderer", x: rndr.offsetLeft, y: rndr.offsetTop, width: rndr.offsetWidth, height: rndr.offsetHeight});
}

function StartVidyoConnector(VC, useTranscodingWebRTC, performMonitorShare, webrtcExtensionPath){
    var vidyoConnector;

    window.onresize = function() {
        if (vidyoConnector) {
            ShowRenderer(vidyoConnector);
        }
    };
    
    window.onbeforeunload = function() {
        vidyoConnector.Destruct();
    }

    VC.CreateVidyoConnector({
        viewId: "renderer",                            // Div ID where the composited video will be rendered, see VidyoConnector.html
        viewStyle: "VIDYO_CONNECTORVIEWSTYLE_Default", // Visual style of the composited renderer
        remoteParticipants: 16,                         // Maximum number of participants to render
        logFileFilter: "warning info@VidyoClient info@VidyoConnector",
        logFileName:"",
        userData:""
    }).then(function(vc) {
        vidyoConnector = vc;
        ShowRenderer(vidyoConnector);      
        RegisterCamera(vidyoConnector);
        RegisterMicrophone(vidyoConnector);
        RegisterSpeaker(vidyoConnector);

        HandleRemoteCamera(vidyoConnector);
        HandleRemoteMute(vidyoConnector);

        HandleParticipantChange(vidyoConnector);
        HandleChat(vidyoConnector);

        JoinCall(vidyoConnector);
    });
}

// =========================== Registering Built-in (Local) devices ===============================
function RegisterCamera(vidyoConnector){
/*Handle appearance and disappearance of camera devices in the system*/
    vidyoConnector.RegisterLocalCameraEventListener({
        onAdded: function(localCamera) {},
        onRemoved: function(localCamera) {},
        onSelected: function(localCamera) {},
        onStateUpdated: function(localCamera, state) {}
    }).then(function() {
		console.log("RegisterLocalCameraEventListener Success");
	}).catch(function() {
		console.error("RegisterLocalCameraEventListener Failed");
	});
}

function RegisterMicrophone(vidyoConnector){
    /*Handle appearance and disappearance of microphone devices in the system*/
	vidyoConnector.RegisterLocalMicrophoneEventListener({
		onAdded: function(localMicrophone) {},
		onRemoved: function(localMicrophone) {},
		onSelected: function(localMicrophone) {},
		onStateUpdated: function(localMicrophone, state) {}
	}).then(function() {
		console.log("RegisterLocalMicrophoneEventListener Success");
	}).catch(function() {
		console.error("RegisterLocalMicrophoneEventListener Failed");
	});
}

function RegisterSpeaker(vidyoConnector){
    /*Handle appearance and disappearance of speaker devices in the system*/
	vidyoConnector.RegisterLocalSpeakerEventListener({
		onAdded: function(localSpeaker) {},
		onRemoved: function(localSpeaker) {},
		onSelected: function(localSpeaker) {},
		onStateUpdated: function(localSpeaker, state) {}
	}).then(function() {
		console.log("RegisterLocalSpeakerEventListener Success");
	}).catch(function() {
		console.error("RegisterLocalSpeakerEventListener Failed");
	});
}
// ======================================================================================

// =========================== Registering Remote devices ===============================
function HandleRemoteCamera(vidyoConnector){
    // Handle remove camera events
    vidyoConnector.RegisterRemoteCameraEventListener({
        onAdded: function(microphone,participant) {
            if ($("#" + participant.id).length != 0) {
                var ele = $("#" + participant.id);
                ele.find("#tableCameraDisplay")[0].style.display = "none";
            }
        },
        onRemoved: function(microphone, participant) {
            if ($("#" + participant.id).length != 0) {
                var ele = $("#" + participant.id);
                ele.find("#tableCameraDisplay")[0].style.display = "inline-block";
            }
        },
        onStateUpdated: function(microphone, participant, state) {
            console.log("Remote Camera state updated: " + state);
        }
    }).then(function(){
        console.log("RegisterRemoteCameraEventListener Success");
    }).catch(function(){
        console.log("RegisterRemoteCameraEventListener Failed");
    });
}

function HandleRemoteMute(vidyoConnector){
    vidyoConnector.RegisterRemoteMicrophoneEventListener({
        onAdded: function(microphone, participant) {
            if ($("#" + participant.id).length != 0) {
                var ele = $("#" + participant.id);
                ele.find("#tableMuteDisplay")[0].style.display = "none";
            }
        },
        onRemoved: function(microphone, participant) {
            if ($("#" + participant.id).length != 0) {
                var ele = $("#" + participant.id);
                ele.find("#tableMuteDisplay")[0].style.display = "inline-block";
          }
        },
        onStateUpdated: function(microphone,participant,state) {
            if ($("#" + participant.id).length != 0) {
                if ("VIDYO_DEVICESTATE_Resumed" == state) {
                    var ele = $("#" + participant.id);
                    ele.find("#tableMuteDisplay")[0].style.display = "none";
                } else if ("VIDYO_DEVICESTATE_Paused" == state) {
                    var ele = $("#" + participant.id);
                    ele.find("#tableMuteDisplay")[0].style.display = "inline-block";
                }
            }
            console.log("Remote Microphone state updated: " + state);
        }
    }).then(function(){
        console.log("RegisterRemoteMicrophoneEventListener Success");
    }).catch(function(){
        console.log("RegisterRemoteMicrophoneEventListener Failed");
    });
}
// ======================================================================================

// ============================== Handle Participants ======================================
function HandleParticipantChange(vidyoConnector) {
    // Report local participant in RegisterParticipantEventListener.
    vidyoConnector.ReportLocalParticipantOnJoined({
        reportLocalParticipant: true
    }).then(function() {
        console.log("ReportLocalParticipantOnJoined Success");
    }).catch(function() {
        console.error("ReportLocalParticipantOnJoined Failed");
    });

    vidyoConnector.RegisterParticipantEventListener({
        onJoined: function(participant) {
            participant.IsLocal().then(function(isLocal) {
                if (isLocal) {
                    setLocalParticipantId(participant.id);
                } else {
                    getParticipantName(participant, function(name) {
                        console.log(participant);
                        $("#participantTable").append($('<tr id="' + participant.id.toString() + '"> <td>' + participant.name + 
                        '</td><td class="table-statuses"><span class="icon icon-camera-off" id="tableCameraDisplay"></span><span class="icon icon-mute-on" id="tableMuteDisplay"></span></td></td></tr>'));
                    });
                }
            });
        },
        onLeft: function(participant) {
            // getParticipantName(participant, function(name) {
            //     $("#participantStatus").html("" + name + " Left");
            // });
            $("#"+participant.id.toString()).remove();
        },
        onDynamicChanged: function(participants) {
            // Order of participants changed
        },
        onLoudestChanged: function(participant, audioOnly) {
            // getParticipantName(participant, function(name) {
            //     $("#participantStatus").html("" + name + " Speaking");
            // });
        }
    }).then(function() {
        console.log("RegisterParticipantEventListener Success");
    }).catch(function() {
        console.err("RegisterParticipantEventListener Failed");
    });
}

function getParticipantName(participant, cb) {
    if (!participant) {
        cb("Undefined");
        return;
    }

    if (participant.name) {
        cb(participant.name);
        return;
    }

    participant.GetName().then(function(name) {
        cb(name);
    }).catch(function() {
        cb("GetNameFailed");
    });
}
// ======================================================================================