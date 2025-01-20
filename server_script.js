// Import required libraries
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session');
const multer = require('multer');
const upload = multer({ dest: '/uploads'});
const fs = require('fs');
const webrtc = require("wrtc");
const { requireSessionAdmin, requireSessionContent } = require('./public/requireSession');
const { getContentKey, getVideoLength, addSecondsToTime } = require('./public/upload_queue_methods'); // functions of upload_queue_methods.js
const ffprobe = require('ffprobe-static');
const ffmpeg = require('fluent-ffmpeg');
// Configure fluent-ffmpeg to use the path to the ffprobe binary
ffmpeg.setFfprobePath(ffprobe.path);
// Create an Express app
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create a connection to the local MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bashdb_final'
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Session configuration with dynamic cookie security
const isProduction = process.env.NODE_ENV === 'production';

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'somesecretkey', // Use environment variable for the secret
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: isProduction, // Only set to true in production
    httpOnly: true, 
    sameSite: 'strict', 
    maxAge: 1000 * 60 * 60 * 2
  }
}));


app.get('/', (req, res) => {
  res.render('index');
});

app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  res.sendFile(filePath);
});

//session handling each view

app.get('/admin', requireSessionAdmin, (req, res) => {
  res.render('admin');
});

app.get('/add-user', requireSessionAdmin, (req, res) => {
  res.render('add-user');
});

app.get('/history', requireSessionContent, (req, res) => {
  res.render('history');
});

app.get('/timeline', requireSessionContent, (req, res) => {
  res.render('timeline');
});

app.get('/login', (req, res) => {
  if (req.session.user) {
    req.session.destroy();
  }
  res.render('login');
});

app.get('/index', (req, res) => {
  res.render('index');
});

// handles login and also sets the session handling
app.post('/login', (request, response) => {
  const username = request.body.username;
  const password = request.body.password;

  connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      response.redirect('/login');
      return;
    }
    if (results.length === 0) {
      response.redirect('/login');
      return;
    }

    const userProfile = results[0];
    if (password !== userProfile.password) {
      response.redirect('../login');
    } else {
      console.log(userProfile.role, userProfile.username);
      request.session.user = { role: userProfile.role, username: userProfile.username };
      if(userProfile.role === 'Admin') {
        response.redirect('/admin'); // Redirect to the admin route
      } else {
        response.redirect('/home'); // Redirect to the admin route
      }
    }
  });
});

// getting video list from the database
app.get('/method/get_video_list', (req, res) => {
  const sql = "SELECT * FROM `content` WHERE `content_type` = 'video'";
  connection.query(sql, (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json(result);
  });
});

// used in uploading media to the database. Uploader will be set based on logged in user
app.post('/method/upload_media', upload.single('file'), (req, res) => {
  try {
    const name = req.file.originalname;
    const targetFilePath = req.file.path;
    const targetFile = path.join(__dirname, '/uploads', name);

    // Check if the file with the same name already exists in the database
    const query = 'SELECT * FROM content WHERE content_title = ?';
    connection.query(query, [name], (selectErr, selectResults) => {
      if (selectErr) {
        console.error('Error querying the database:', selectErr);
        res.status(500).send(`Internal Server Error: ${selectErr.message}`);
        return;
      }

      if (selectResults.length === 0) {
        const fileExtension = name.split('.').pop();
        const extensionsArr = ['mp4', 'mov', 'mpeg', 'avi'];

        if (extensionsArr.includes(fileExtension)) {
          fs.renameSync(targetFilePath, targetFile);

          // Use fluent-ffmpeg to get video duration
          ffmpeg.ffprobe(targetFile, async (err, metadata) => {
            if (err) {
              console.error('Error analyzing file:', err);
              res.status(500).send(`Internal Server Error: ${err.message}`);
              return;
            }

            const videoLength = Math.round(metadata.format.duration);

            // Insert file details into the database
            const uploader = req.session.user.username;
            const pathfile = '/uploads/' + name;

            const insertQuery =
              'INSERT INTO content(content_title, content_type, video_length, uploader, location_vid) VALUES(?, "video", ?, ?, ?)';
            connection.query(insertQuery, [name, videoLength, uploader, pathfile], (insertErr, insertResult) => {
              if (insertErr) {
                console.error('Error inserting into database:', insertErr);
                res.status(500).send(`Internal Server Error: ${insertErr.message}`);
                return;
              }

              console.log('File details inserted into the database successfully');
              console.log(`File ${name} uploaded successfully`);
              console.log(`Video length: ${videoLength} seconds`);
              res.redirect('/timeline');
            });
          });
        } else {
          res.status(400).send('Invalid file extension');
        }
      } else {
        res.status(400).send('Duplicate file detected');
      }
    });
  } catch (error) {
    console.error('Unhandled error:', error);
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

// upload the finalize queue of the user
app.post('/method/upload_queue', async (req, res) => {
  let airingStart = "08:00:00";
  const selectedDate = req.body.selectedDate;
  const addedVideos = req.body.addedVideos;
  const videosArray = JSON.parse(addedVideos);
  try {
    for (const video of videosArray) {
      // Get the content key of the video - imported from upload_queue_methods
      const contentKey = await getContentKey(connection, video);

      // Get the video length from the content table - imported from upload_queue_methods
      const videoLength = await getVideoLength(connection, contentKey);

      // Calculate the airing end time based on the current video's length - imported from upload_queue_methods
      const airingEnd = addSecondsToTime(airingStart, videoLength);

      // Insert into the schedule table
      await insertIntoSchedule(connection, contentKey, selectedDate, airingStart, airingEnd);

      // Update the airing start time for the next video
      airingStart = airingEnd;
    }
  } catch (error) {
    console.error('Unhandled error:', error);
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }

  res.redirect('/timeline');
});

// Add the video on the schedule in database
function insertIntoSchedule(conn, contentKey, selectedDate, airingStart, airingEnd) {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO schedule (content_key, airing_date, airing_start, airing_end, set_by) VALUES (?, ?, ?, ?, 'juancontent')";
    conn.query(query, [contentKey, selectedDate, airingStart, airingEnd], (err, result) => {
      if (err) {
        console.error('Error inserting into schedule:', err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// method that will get the scheduled videos for the day
app.get('/method/get-scheduled-videos', (req, res) => {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Manila'
  }).replace(/\//g, '-');
  
  console.log(today);
  const sql = `
    SELECT content.content_title, content.location_vid, content.uploader,
    content.content_type, schedule.airing_start, schedule.airing_end, content.video_length
    FROM schedule
    INNER JOIN content ON schedule.content_key = content.content_key
    WHERE DATE_FORMAT(schedule.airing_date, '%m-%d-%Y') = ?;
  `;
  connection.query(sql, [today], (err, results) => {
    if (err) {
      console.error('Error fetching scheduled videos:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    console.log(results);
    res.json(results);
  });
});

// method that will get the scheduled videos for a specific date - used in history.ejs/Schedules
app.get('/method/get-scheduled-videos-history', (req, res) => {
  const selectedDate = req.query.selectedDate || new Date().toISOString().split('T')[0];
  console.log(selectedDate);

  const sql = `
      SELECT content.content_title, content.location_vid, content.uploader,
      content.content_type, schedule.airing_start, schedule.airing_end, content.video_length
      FROM schedule
      INNER JOIN content ON schedule.content_key = content.content_key
      WHERE DATE_FORMAT(schedule.airing_date, '%Y-%m-%d') = ?;
  `;

  connection.query(sql, [selectedDate], (err, results) => {
      if (err) {
          console.error('Error fetching scheduled videos:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }
      console.log(results);
      res.json(results);
  });
});

// Add new user endpoint (requires authentication)
app.post('/addUser', (req, res) => {
  const { username, password, first_name, last_name, role } = req.body;

  // Insert new user into the database
  // temporary removed role
  connection.query(
    'INSERT INTO users (username, password, first_name, last_name, role) VALUES (?, ?, ?, ?, "Content Manager")',
    [username, password, first_name, last_name],
    (err, result) => {
      if (err) {
        console.log("fail");
        res.status(500).json({ success: false, message: 'Failed to add user' });
      } else {
        console.log("success");
        res.status(200).json({ success: true, message: 'User added successfully' });
      }
    }
  );
});

// Delete user endpoint (requires authentication)
app.post('/delete-user', (req, res) => {
  const { username } = req.body;

  // Delete user from the database
  connection.query('DELETE FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({ success: false, message: 'Error deleting user' });
      return;
    }
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  });
});

// Logout endpoint to destroy the session
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Error logging out' });
      return;
    }
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.redirect('/login'); // Redirect to login page after logout
  });
});


// let newStream;
let senderStream; //current streamer
// Define an event emitter for stream changes
const streamChangeEmitter = new (require('events'))();

//receive viewer's post request
app.post("/viewer", async ({ body }, res) => {
  try {
    

    //new peer object per viewer
    const viewerPeer = new webrtc.RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.stunprotocol.org"
        }
      ]
    });

    const desc = new webrtc.RTCSessionDescription(body.sdp);
    await viewerPeer.setRemoteDescription(desc);

    connection.on('close', () => {
      viewerPeer.close();
      console.log('A viewer disconnected');
    });

    if (!senderStream || !senderStream.getTracks()) {
      throw new Error("Sender stream or tracks not available. (No one is live)");
    }

    streamChangeEmitter.on('streamChanged', () => {
      // Perform actions when the stream changes
      console.log("Stream changed, closing viewer peer");
      viewerPeer.close();
    });

    const tracks = senderStream.getTracks();
      tracks.forEach(track => {
      viewerPeer.addTrack(track, senderStream);
    });

    const answer = await viewerPeer.createAnswer();
    await viewerPeer.setLocalDescription(answer);
    console.log("New viewer joined");

    const payload = {
      sdp: viewerPeer.localDescription
    }

    res.json(payload);
  } catch (error) {
    console.error("Error in consumer endpoint:", error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// let streamCount = 0;
//Broadcast post
app.post('/broadcast', async ({ body }, res) => {
    console.log("New stream peer connection started")
    const broadcasterPeer = new webrtc.RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.stunprotocol.org"
            }
        ]
    });
    //event for when remote comes in
    broadcasterPeer.ontrack = (e) => handleNewStream(e, broadcasterPeer);
    //This was supposed to detect streams endig but we ran out of time
  //   broadcasterPeer.oniceconnectionstatechange = (event) => {
  //     console.log('ICE connection state change:', broadcasterPeer.iceConnectionState);
  //     if (broadcasterPeer.iceConnectionState === 'closed') {
  //         // Handle stream end here
  //         console.log('A stream just ended');
  //         streamCount = streamCount - 2;
  //     }
  // };

    //payload of the post request, sdp is the offer made from the broadcaster
    const desc = new webrtc.RTCSessionDescription(body.sdp); 

    connection.on('close', () => {
      broadcasterPeer.close();
      console.log('A streamer disconnected');
    });

    /*allow us to accept the offer and generate an answer
    peer to peer between browsers but this time it's the server
    */
    await broadcasterPeer.setRemoteDescription(desc);
    const answer = await broadcasterPeer.createAnswer();
    await broadcasterPeer.setLocalDescription(answer);
    const payload = {
        sdp: broadcasterPeer.localDescription
    }

    res.json(payload);
});

const activeStreams = [];

//Handle new stream
function handleNewStream(e, peer) {
  console.log("New stream detected in handleNewStream()");
  // newStream = e.streams[0];
  // activeStreams.push(senderStream);
  // senderStream = newStream;
  senderStream = e.streams[0]
  // streamCount++;
  streamChangeEmitter.emit('streamChanged');
}

app.get('/home', requireSessionContent, (req, res) => {
  res.render('home', { activeStreams });
});

app.post('/get-active-stream-count', (req, res) => {
  // Send information about active streams or peers
  console.log(activeStreams, streamCount);
  res.json({ success: true, streamCount });
});

// Server setup
let port = 8001
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});