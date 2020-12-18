const express = require('express');
const cors = require('cors');
const path = require('path');

//Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'client/build')));

//Anything that doesn't match above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
})

//Create the server
const app = express();

//Choose the eport and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Hello from port ${PORT}`);
});