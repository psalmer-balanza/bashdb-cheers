let peer;

window.onload = () => {
    // document.getElementById('stream-button').onclick = () => {
    //     init();
    // }
    // document.getElementById('stream-recorded-video-button').onclick = () => {
    //     initVideo();
    // }
    window.onbeforeunload = () => {
        endStream(); //end stream when refreshed/closed
    }  
}

window.onload = async () => {
    document.getElementById('stream-button').onclick = () => {
        handleGoLiveButtonClick();
    } 

    document.getElementById('end-button').onclick = () => {
        endStream();
    }

    document.getElementById('stream-recorded-video-button').onclick = () => {
        handleLoadActiveStreamsButtonClick();
    }

    window.onbeforeunload = () => {
        endStream(); // End stream when refreshed/closed
    }

    // Check the time 2 seconds an call checkAndReload function every 2 seoncds
    intervalId = setInterval(() => {
        checkAndReload();
    }, 2000);

}

// Fetch videos and check whether there are scheduled videos for the day
// Khyle
async function checkAndReload() {
    try {
        const response = await axios.get('/method/get-scheduled-videos');
        const scheduledVideos = response.data;
        console.log('checkAndReload');

        if (scheduledVideos.length > 0) {
            // Get the current time
            const currentTime = new Date();

            // Get the airing_start and airing_end of the first scheduled video
            const firstScheduledVideo = scheduledVideos[0];
            const today = new Date(); // get today's date

            // Parse the time part of airing_start and airing_end
            const airingStartParts = firstScheduledVideo.airing_start.split(':');
            const airingEndParts = firstScheduledVideo.airing_end.split(':');

            // Set the time part of today to match airing_start
            today.setHours(parseInt(airingStartParts[0]), parseInt(airingStartParts[1]), parseInt(airingStartParts[2]), 0);

            // Create Date objects for airing_start and airing_end
            const airingStart = today;
            const airingEnd = new Date(today); // clone today's date
            airingEnd.setHours(parseInt(airingEndParts[0]), parseInt(airingEndParts[1]), parseInt(airingEndParts[2]), 0);
            console.log(airingStart);
            console.log(airingEnd);
            console.log(currentTime);

            // Check if the current time is within the airing_start and airing_end of the first video
            if (currentTime >= airingStart && currentTime <= airingEnd) {
                loadScheduledVideos(scheduledVideos);
                console.log("Executing initVideo");
                initVideo();

                clearInterval(intervalId); // Clears the intervalId, which keeps the website from refreshing
            } else {
                console.log('Please wait for the scheduled video of the day');
            }
        } else {
            console.log('No scheduled videos for today');
            clearInterval(intervalId);
        }
    } catch (error) {
        console.error('Error checking and reloading:', error.message);
    }
}

// gets the video element and the exact video URL
// Khyle
async function loadScheduledVideos(scheduledVideos) {
    try {
        const videoElement = document.getElementById('recordedVideo');
        const playlist = scheduledVideos.map(video => ({
            title: video.content_title,
            src: `uploads/${video.content_title}`,
            // src: `http://localhost/bashdb-final-project${video.location_vid}`
        }));

        playPlaylist(videoElement, playlist);
    } catch (error) {
        console.error('Error loading scheduled videos:', error.message);
    }
}

// Play all the videos on the list
// Khyle
function playPlaylist(videoElement, playlist) {
    let currentVideoIndex = 0;

    function playNextVideo() {
        currentVideoIndex = (currentVideoIndex + 1) % playlist.length;

        // Check if the current video index exceeds the playlist length
        if (currentVideoIndex === playlist.length) {
            // Stop video playback
            stopVideoPlayback(videoElement);
        } else {
            playCurrentVideo();
        }
    }

    function playCurrentVideo() {
        const currentVideo = playlist[currentVideoIndex];
        videoElement.src = currentVideo.src;
        console.log("Now playing", currentVideo.src);

        videoElement.addEventListener('ended', playNextVideo);
        videoElement.autoplay = true;
        videoElement.controls = false;

        // Ensure autoplay only for the first video
        if (currentVideoIndex === 0) {
            videoElement.play()
                .catch(error => console.error('Error playing video:', error));
        }
    }

    // Start playing the playlist
    playCurrentVideo();
}


let isGoLiveButtonActive = true;
let isLoadActiveStreamsButtonActive = true;
disableVideoStreamButton();

// if live button is clicked, pause the scheduled video, and disable the button
// Khyle
async function handleGoLiveButtonClick() {
    const recordedVideo = document.getElementById('recordedVideo');

    if (isGoLiveButtonActive) {
        // Pause the recorded video
        recordedVideo.pause();
        init();
        isGoLiveButtonActive = false;
        isLoadActiveStreamsButtonActive = true;
        enableButton('stream-recorded-video-button');
        disableButton('stream-button');
    }
}
    
// if load active stream button is clicked, resume the scheduled video, and disable the button
// Khyle
function handleLoadActiveStreamsButtonClick() {
    const recordedVideo = document.getElementById('recordedVideo');

    if (isLoadActiveStreamsButtonActive) {
        // Resume the recorded video
        recordedVideo.play();
        initVideo();
        isLoadActiveStreamsButtonActive = false;
        isGoLiveButtonActive = true;
        disableButton('stream-recorded-video-button');
        enableButton('stream-button');
    }
}

// function to disable the button
// Khyle
function disableButton(buttonId) {
    const button = document.getElementById(buttonId);
    button.disabled = true;
    button.style.opacity = 0.5;
}

// function to enable the button
// Khyle
function enableButton(buttonId) {
    const button = document.getElementById(buttonId);
    button.disabled = false;
    button.style.opacity = 1; // Restore normal appearance
}

// function to disable the video stream button
// Khyle
function disableVideoStreamButton() {
    const button = document.getElementById('stream-recorded-video-button');
    button.disabled = true;
    button.style.opacity = 0.5;
}

/* Initializes peer connection to the server, gets user media (audio/video) and 
    outputs video to the streamer
    Psalmer
*/
async function init() {
    const bothStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
    // const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    document.getElementById("mainVideo").srcObject = videoStream;
    peer = createPeer();

    //add the stream
    const tracks = bothStream.getTracks();

    // Loop through each track in bothStream
    tracks.forEach(track => {
        //send tracks to server
        peer.addTrack(track, bothStream);
    });
}

/* Initializes peer connection to the server, gets the contents of a specific video
    element, takes the audio and video and sends it to the server through the peer
    Psalmer
*/
async function initVideo() {
    const video = document.getElementById("recordedVideo");

    await video.play();
    peer = createPeer();
    // HTMLMediaElement API
    const videoStream = video.captureStream();
    // MediaStream API
    const videoTrack = videoStream.getVideoTracks()[0];
    const audioTrack = videoStream.getAudioTracks()[0];

    // Combine video/audio tracks
    const clonedStream = new MediaStream([videoTrack, audioTrack]);
    const tracks = clonedStream.getTracks();
    
    // Add the stream
    tracks.forEach(track => {
        //send tracks to server
        peer.addTrack(track, clonedStream);
    });
}

/*
    Creates a new RTCPeerConnection and passes it to the handleNegotiationNeededEvent
    returns the created peer
    Psalmer
*/
function createPeer() {
    const newPeer = new RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.stunprotocol.org"
            }
        ]
    });
    newPeer.onnegotiationneeded = () => handleNegotiationNeededEvent(newPeer);

    return newPeer;
}

/* Creates an offer to the server, posts to the broadcast endpoint along with the stream 
    payload, finally accepts the post answer
    Psalmer
*/
async function handleNegotiationNeededEvent(peer) {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    const payload = {
        sdp: peer.localDescription
    };

    const { data } = await axios.post('/broadcast', payload);
    const desc = new RTCSessionDescription(data.sdp);
    //accept the answer of the post
    peer.setRemoteDescription(desc).catch(e => console.log(e)); 
}


function endStream() {
    if (peer) {
        peer.close();
    }
    console.log('Stream ended');
}