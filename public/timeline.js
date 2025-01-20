document.addEventListener('DOMContentLoaded', function () {
    const finalizeButton = document.getElementById('finalize-button'); 
    // disable the button on page load
    finalizeButton.disabled = true;
    finalizeButton.style.backgroundColor = 'grey';

    // Fetch video files from the server and display them to the page
    fetch('/method/get_video_list')
        .then(response => response.json())
        .then(videoList => {
            console.log('Video List:', videoList); 

            const videoListContainer = document.getElementById('video-list');
        
            // Update the main videos
            document.getElementById('displayed-video').innerHTML = `
                <video src="http://localhost/bashdb-final-project/${videoList[0].location_vid}" controls autoplay></video>
                <h3 class="displayed-video-title">${videoList[0].content_title}</h3>`; 

            // Update the video list
            videoList.forEach(videoInfo => {
                const videoElement = document.createElement('div');
                videoElement.className = 'vid';
                videoElement.innerHTML = `
                    <video src="http://localhost/bashdb-final-project/${videoInfo.location_vid}" controls muted></video>
                    <h3 class="video-list-title">${videoInfo.content_title}</h3>`; 
                videoListContainer.appendChild(videoElement);
            });

    })
    .catch(error => console.error('Error fetching video list:', error));

// Event listener for date input change
    const dateInput = document.getElementById('date-input');
    dateInput.addEventListener('change', function () {
        finalizeButton.disabled = false;
        finalizeButton.style.backgroundColor = '';
    });

    const addButton = document.querySelector('.btn-add');
    const videoQueue = document.getElementById('queue-list');
    const videoListContainer = document.getElementById('video-list');
    const addedVideos = []; 
    const hiddenInput = document.getElementById('addedVideos');

    // Function to be executed on button click
    // for debugging purposes
    function handleFinalizeButtonClick() {
        if (!finalizeButton.disabled) {
        
            console.log('Button clicked!');

            console.log(hiddenInput.value);
        }
    }

    // Handle finalize button on click
    finalizeButton.addEventListener('click', handleFinalizeButtonClick);

    addButton.addEventListener('click', function () {
        const selectedVideoTitle = prompt('Select a video to add to the queue:', '');
        console.log(videoListContainer);

        if (selectedVideoTitle) {
            // print selectedvideo title
            console.log('Selected Video Title:', selectedVideoTitle);

            // Find the selected video in the video list
            const selectedVideo = Array.from(videoListContainer.querySelectorAll('.vid')).find(video => {
                const titleElement = video.querySelector('h3.video-list-title');
                const title = titleElement ? titleElement.innerText.trim() : null;
                return title && title.toLowerCase() === selectedVideoTitle.trim().toLowerCase();
            });

            if (selectedVideo) {
                // Add the selected video to the array
                addedVideos.push(selectedVideoTitle);

                const queueDivElement = document.createElement('div');
                queueDivElement.className = 'vid active';
                queueDivElement.id = 'video-queue';

                // Clone the selected video and add it to the video queue
                const clonedVideo = selectedVideo.cloneNode(true);
                clonedVideo.firstChild.nextSibling.className = 'queueTitle';
                clonedVideo.firstChild.nextSibling.id = 'queueTitle';
                // Append controls to the clonedVideo
                if (addedVideos.length === 1) {
                    templateVideo = document.getElementById('video-queue');
                    videoQueue.removeChild(templateVideo);
                }
                queueDivElement.appendChild(clonedVideo);
                // Append div to the main div
                videoQueue.appendChild(queueDivElement);
                // Update the hidden input value 
                hiddenInput.value = JSON.stringify(addedVideos);
                console.log("Hidden Input Value: ", hiddenInput.value)
            } else {
                alert('Selected video not found in the video list.');
            }
        }
        console.log(addedVideos);
    });
});