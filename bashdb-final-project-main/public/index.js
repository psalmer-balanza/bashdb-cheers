
let peer = createPeer();
let connectionCounter = 0;

window.onload = () => {
    document.getElementById('refresh-button').onclick = () => {
        console.log("Manually refreshing peer connection");
        init();
    }
}

document.addEventListener("DOMContentLoaded", (event) => {
    tryToConnectToStream();
});

/* Initializes peer connection to the server, creates a peer that only accepts
    audio and video, retries connection when disconnected or swapping streams (still disconnected)
    Psalmer
*/
async function init() {
    peer = createPeer();
    //Pipe between two peers but receive only
    peer.addTransceiver("audio", { direction: "recvonly" });
    peer.addTransceiver("video", { direction: "recvonly" });
    // peer.addTransceiver("video", "audio", { direction: "recvonly" });
    peer.oniceconnectionstatechange = function(event) {
        // console.log('ICE connection state change:', peer.iceConnectionState);
        if(peer.iceConnectionState == 'disconnected') {
            console.log("Peer disconnected, retrying")
            setTimeout(() => init(), 1000);
        } 
    };
}

/*
    Creates a new RTCPeerConnection and passes it to the handleNegotiationNeededEvent
    returns the created peer
    Psalmer
*/
function createPeer() {
    try {
        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.stunprotocol.org"
                }
            ]
        });
        // peer.addTransceiver("audio", { direction: "recvonly" });
        // peer.addTransceiver("video", { direction: "recvonly" });

        peer.ontrack = (e) => handleNewStream(e, peer);
        // Send negotiation to server
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

        return peer;
    } catch (error) {
        console.log("Error with peer connection:", error.message);
    }
}

/* Creates an offer to the server, posts to the viewer endpoint, 
    finally accepts the post answer
    Psalmer
*/
async function handleNegotiationNeededEvent(peer) {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    const payload = {
        sdp: peer.localDescription
    };
    //Payload is an offer
    const { data } = await axios.post('/viewer', payload);
    const desc = new RTCSessionDescription(data.sdp);
    peer.setRemoteDescription(desc).catch(e => console.log("Negotiation: ", e));
}

// Adds stream to the video element
// Psalmer
function handleNewStream(e) {
    const mainVideo = document.getElementById("mainVideo");

    // Set the srcObject to the stream
    mainVideo.srcObject = e.streams[0];

    // Unmute the video
    mainVideo.muted = false;
}

// Recursion to find a stream or reconnect, causes memory leaks to the CPU haha
// Psalmer
function tryToConnectToStream() {
    console.log("Trying again, peer:", peer.iceConnectionState);

    if(peer.iceConnectionState != 'connected' && connectionCounter < 10) {
        connectionCounter++;
        init();
        console.log("Trying again with recursion");
        // setTimeout(tryToConnectToStream(), 5000);
    } else if (connectionCounter>10) {
        console.log("No stream detected or streamer offline, please reload the stream or page to try again.");
    } else if (peer.iceConnectionState == 'connected'){
        console.log(`Successfully connected to stream after ${connectionCounter} tries`);
        connectionCounter = 0;
    }
}

