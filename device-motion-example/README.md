Device motion example for Wekinator using web sockets and OSC.  
To run:
```sh
cd device-motion-example
npm install
npm run start # live reload server
npm run build # builds+uglifies javascript into bundle.js
```

How to use:  
  1. Open http://your-machine's-ip:3000 on your mobile device
  2. Press the screen to record gesture
  3. Make a gesture (like a circle)
  4. Let go of the screen when you finish gesture. An array of data will be sent to Wekinator to train/recognize.


