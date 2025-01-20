to run the app
`npm i`
then 
`npm run startServer`

Please ensure that the included database is running (preferrably on WampServer)

For streamers:
1. Navigate to `chrome://flags/#unsafely-treat-insecure-origin-as-secure` in Chrome.
2. Find and enable the `Insecure origins treated as secure` section (see below).
3. Add any addresses you want to ignore the secure origin policy for. Remember to include the port number too (if required).
4. Save and restart Chrome.

http://(your IP):8001

For server streamer monitoring:
Monitor WebRTC traffic in Chrome: chrome://webrtc-internals/

For wampserver configurations (to allow back and forth between php and nodejs):


