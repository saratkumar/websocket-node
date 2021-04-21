const express = require('express')
const app = express();
const router = express.Router();
const cors = require('cors');
const http = require('http');
const fs = require("fs");
const helper = require("./constants/common")

const process = require('process');

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
  
  socket.on(helper.EVENTLIST.REQUEST_FOR_NEW_DATA, (message) => {
    fs.readFile(helper.MOCK_DATA_URL, function (err, data) {
      // Check for errors
      if (err) throw err;
      // Converting to JSON
      const source = JSON.parse(data);
      loadMockData(source);

      //For demo purpose loading data again
      setTimeout(() => {
        loadMockData(source);
      }, 5000);
      
    });
    // io.emit('new-message', message);
  });
});


server.listen(port, () => {
  console.log(`started on port: ${port}`);
});

function loadMockData(source) {
  let count = 0;
  let interval = 1000;
  let = setInterval(() => {
    if (count < 5) {
      let res = source.datatable.data.slice(count, count + 2000);
      io.emit(helper.EVENTLIST.INCOMING_DATA, res);
      count++;
    } else {
      interval = 0;
    }
  }, interval);
}





