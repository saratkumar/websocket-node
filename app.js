const express = require('express')
const app = express();
const router = express.Router();
const cors = require('cors');
const http = require('http');
const fs = require("fs");
const helper = require("./constants/common")
var interval;
var source = '';
const process = require('process');
const { clearInterval } = require('timers');
app.use(cors());
app.use('/api', router);
router.get('/get-stats', (req, res) => {
  // Allocating process module
  const process = require('process');
  res.json({ cpuUsage: process.cpuUsage(), currentTime: new Date(new Date().toUTCString())});
  
});


const server = http.Server(app);

// Read users.json file

// const socketIO = require('socket.io');
const io = require("socket.io")(server, {
  cors: {
    origin: helper.DEV_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
});


const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
  io.emit(helper.EVENTLIST.CONNECT_STATUS, true);
  socket.on('test', (count) => {
    clearInterval(interval);
    io.emit('stats', { cpuUsage: process.cpuUsage(), currentTime: new Date(new Date().toUTCString()), purpose: 'stats' });
  });
  socket.on(helper.EVENTLIST.REQUEST_FOR_NEW_DATA, (count) => {
    if(count) {
      loadMockData(count);
    } else {
      fs.readFile(helper.MOCK_DATA_URL, function (err, data) {
        // Check for errors
        if (err) throw err;
        // Converting to JSON
        source = JSON.parse(data);
        loadMockData();
      });
    }
      
    
    // io.emit('new-message', message);
  });

  socket.on(helper.EVENTLIST.DISCONNECT, (reason) => {
    io.emit(helper.EVENTLIST.CONNECT_STATUS, false);
    socket.disconnect();
  });
});


server.listen(port, () => {
  console.log(`started on port: ${port}`);
});

function loadMockData(count) {
  count = count ? count : 0;
  interval = setInterval(() => {
    if (count > source.datatable.data.length) count = 0;
    let res = source.datatable.data.slice(count, count + 1000);
    io.emit(helper.EVENTLIST.INCOMING_DATA, res);
    count = count + 1000;
  }, 100);

  
  

}





