var isSharingWindow = false;

function handleScreenSharing(vidyoConnector, useTranscodingWebRTC, performMonitorShare, webrtcExtensionPath, dataNewStatus){

    if(performMonitorShare){
        StartMonitorShare();
    }

    if(!useTranscodingWebRTC){
        StartWindowShare();
    }
    else{
        if(isSharingWindow === false){
            StartWindowShare();
        }
    }

    function StartWindowShare(){
        vidyoConnector.RegisterLocalWindowShareEventListener({
            onAdded: function(localWindowShare){
                vidyoConnector.SelectLocalWindowShare({
                    localWindowShare: localWindowShare
                }).then(function(){
                    console.log("SelectLocalWindowShare Success");
                }).catch(function(){
                    console.error('SelectLocalWindowShare Failed');
                });
            },
            onRemoved: function(localWindowShare){},
            onSelected: function(localWindowShare){
                if(localWindowShare){
                    isSharingWindow = true;
                    $('.screen-share-button span').removeClass('icon-screen-share').addClass('icon-screen-share-off');
                    $('.screen-share-button').attr('data-status', dataNewStatus);
                }
                else{
                    isSharingWindow = false;
                    $('.screen-share-button span').removeClass('icon-screen-share-off').addClass('icon-screen-share');
                    $('.screen-share-button').attr('data-status', dataNewStatus);
                }
            },
            onStateUpdated: function(localWindowShare, state) {}
        }).then(function(result){
            if(result){
                console.log("RegisterLocalWindowShareEventListener Success");
            }else{
                console.error("registerLocalWindowShareEventListener Failed");
                if (webrtcExtensionPath.length === 0) {
                    alert("Error: cannot initiate window sharing.");
                } else {
                    prompt("An extension is needed to initiate window sharing. Navigate to the URL below to install.", webrtcExtensionPath);
                }
            }
        }).catch(function() {
            console.error("RegisterLocalWindowShareEventListener Failed");
        });
    }

    function StartMonitorShare(){
        // Register for monitor share status updates
        vidyoConnector.RegisterLocalMonitorEventListener({
            onAdded: function(localMonitorShare){
                vidyoConnector.SelectLocalMonitor(localMonitorShare)
                    .then(function(){
                        console.log("SelectLocalMonitorShare Success");
                    }).catch(function(){
                        console.error("SelecteLocalMonitorShare Failed");
                    });
                if(localMonitorShare.name != ""){
                    monitorShareComp = localMonitorShare; 
                }

                console.log("Added screen 2");
            },
            onRemoved: function(localMonitorShare){},
            onSelected: function(localMonitorShare){
                if (localMonitor) {
                    $('.screen-share-button span').removeClass('icon-screen-share').addClass('icon-screen-share-off');
                } else {
                    // Unassign the image source in the UI from the preview frame
                    $('.screen-share-button span').removeClass('icon-screen-share-off').addClass('icon-screen-share');
                }
            },
            onStateUpdated: function(localMonitor, state) {}
        }).then(function(){
            console.log("RegisterLocalMonitorShareEventListener Success");
        }).catch(function(){
            console.error("RegisterLocalMonitorShareEventListener Failed");
        })
    }
}

function startScreenSharing(){
    let status = $('.screen-share-button').attr('data-status') === 'off';
    let dataNewStatus = status?'off':'on';
    handleScreenSharing(vidyoConnector, useTranscodingWebRTC, performMonitorShare, webrtcExtensionPath, dataNewStatus);    
}