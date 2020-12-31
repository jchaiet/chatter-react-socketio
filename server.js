const express = require('express');
const path = require('path');

//Create the server
const app = express();
const server = require('http').createServer(app);

//Start IO
const io = module.exports.io = require("socket.io")(server);
const SocketManager = require('./SocketManager');

io.on('connection', SocketManager);

//Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'client/build')));

//Anything that doesn't match above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
})

//Choose the eport and start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Hello from port ${PORT}`);
});