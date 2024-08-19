// Function to get video length from the content table
async function getVideoLength(conn, contentKey) {
    return new Promise((resolve, reject) => {
      const query = "SELECT video_length FROM content WHERE content_key = ?";
      conn.query(query, [contentKey], (err, result) => {
        if (err) {
          console.error('Error fetching video length:', err);
          reject(err);
        } else {
          const videoLength = result.length > 0 ? result[0].video_length : 0;
          resolve(videoLength);
        }
      });
    });
  }
  
  // Function to get content key based on the video title
  async function getContentKey(conn, videoTitle) {
    return new Promise((resolve, reject) => {
      const query = "SELECT content_key FROM content WHERE content_title = ?";
      conn.query(query, [videoTitle], (err, result) => {
        if (err) {
          console.error('Error fetching content key:', err);
          reject(err);
        } else {
          const contentKey = result.length > 0 ? result[0].content_key : -1;
          resolve(contentKey);
        }
      });
    });
  }

// Function to add seconds to a given time 
function addSecondsToTime(time, seconds) {
    const timeInSeconds = new Date(`1970-01-01T${time}Z`).getTime() / 1000;
    const newTimeInSeconds = timeInSeconds + seconds;
    
    const date = new Date(newTimeInSeconds * 1000);
    const newTime = date.toISOString().substr(11, 8);
  
    return newTime;
  }

// Export the upload_queue_methods.js for the server to use
module.exports = {
  getVideoLength,
  getContentKey,
  addSecondsToTime
};