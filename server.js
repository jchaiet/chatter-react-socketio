const express = require('express');
const cors= require('cors');

//Create the server
const app = express();

//Choose the eport and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Hello from port ${PORT}`);
});