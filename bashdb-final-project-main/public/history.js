document.addEventListener('DOMContentLoaded', async () => {
    try {
        const dateInput = document.getElementById('selectedDate');

        // Event listener to the date input
        dateInput.addEventListener('change', async () => {
            // Fetch scheduled videos for the selected date
            await fetchScheduledVideos();
        });

        // Fetch initial scheduled videos on page load
        await fetchScheduledVideos();
    } catch (error) {
        console.error('Error initializing history page:', error);
    }
});

async function fetchScheduledVideos() {
    try {
        const selectedDate = document.getElementById('selectedDate').value;
        // Format the date as 'yyyy-mm-dd'
        const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
        console.log(formattedDate);
        //fetch videos according to the selected date
        const response = await fetch(`/method/get-scheduled-videos-history?selectedDate=${formattedDate}`);
        const data = await response.json();

        const tableBody = document.getElementById('scheduledVideosTableBody');
        // Clear existing rows
        tableBody.innerHTML = '';

        //update rows according to the fetched Data
        if (data && data.length > 0) {
            // Iterate through the data and append rows to the table
            data.forEach(video => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${video.content_title}</td>
                    <td>${video.content_type}</td>
                    <td>${video.video_length}</td>
                    <td>${video.airing_start}</td>
                    <td>${video.airing_end}</td>
                    <td>${video.uploader}</td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            // Display a message when there are no scheduled videos
            const noVideosRow = document.createElement('tr');
            noVideosRow.innerHTML = '<td colspan="6">No scheduled videos found for the selected date.</td>';
            tableBody.appendChild(noVideosRow);
        }
    } catch (error) {
        console.error('Error fetching scheduled videos:', error);
    }
}