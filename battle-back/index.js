const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const cors = require('cors');
const app = express();
app.use(cors());
const server = http.createServer(app);

let lobbyArray = [];

const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
  },
});
// const io = socketIo(server)

const PORT = 2345;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname) + '/index.html');
});

let interval;

io.on('connection', (socket) => {
  console.log('New client connected', socket.id);
  socket.on('join', (room) => {
    console.log(room, 'created or joined');
    lobbyArray.push(room);
    lobbyArray.filter((item, index) => lobbyArray.indexOf(item) === index);
    socket.join(room);
  });
  socket.on('send', (message, room) => {
    // console.log(message + 'in' + room);
    // socket.to(room).emit('receive-message', message);
    console.log(message + ' has been send to' + room);
    socket.to(room).emit('receive-message', message);
  });
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getLobbyCount(socket), 1000);
});

const getLobbyCount = (socket) => {
  const filterArr = lobbyArray.filter(
    (item, index) => lobbyArray.indexOf(item) === index
  );
  socket.emit('count', filterArr);
};

server.listen(PORT, () => {
  console.log(`Server exists here ${PORT}`);
});
