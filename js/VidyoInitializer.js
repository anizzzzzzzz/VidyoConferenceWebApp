var platformInfo = {};
var webrtcExtensionPath = "";
var webrtcInitializeAttempts = 0;
var useTranscodingWebRTC, performMonitorShare;

function onVidyoClientLoaded(status){
    console.log("VidyoClient load state - " + status.state);
    switch (status.state){
        case "READY":
            // If WebRTC is being used, specify the screen share extension path.
            if (VCUtils.params.webrtc === "true") {
                if (status.hasOwnProperty("downloadPathWebRTCExtensionFirefox"))
                    webrtcExtensionPath = status.downloadPathWebRTCExtensionFirefox;
                else if (status.hasOwnProperty("downloadPathWebRTCExtensionChrome"))
                    webrtcExtensionPath = status.downloadPathWebRTCExtensionChrome;
            }

            // Determine which Vidyo stack will be used: Native WebRTC, Transcoding WebRTC or Native (Plugin/Electron)
            if (status.description.indexOf("Native XMPP + WebRTC") > -1) {
                // Native WebRTC
                useTranscodingWebRTC = false;
                performMonitorShare  = false;
            } else if (status.description.indexOf("WebRTC successfully loaded") > -1) {
                // Transcoding WebRTC
                useTranscodingWebRTC = true;
                performMonitorShare  = false;
                ++webrtcInitializeAttempts;
            } else {
                // Native (Plugin or Electron)
                useTranscodingWebRTC = false;
                performMonitorShare  = true;
            }

            // After the VidyoClient is successfully initialized a global VC object will become available
            // All of the VidyoConnector gui and logic is implemented in VidyoConnector.js
            StartVidyoConnector(VC, useTranscodingWebRTC, performMonitorShare, webrtcExtensionPath);
            break;
        case "RETRYING":     // The library operating is temporarily paused
            break;
        case "FAILED":       // The library operating has stopped
            break;
        case "FAILEDVERSION":// The version of the Javascript library does not match the plugin
            status.plugInVersion; // The Version of the plugin currently installed
            status.jsVersion;     // The Version of the Javascript library loaded
            break;
        case "NOTAVAILABLE": // The library is not available
            break;     
    }
    return true;
}