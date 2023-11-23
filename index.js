const express = require('express');
const app = express();

app.get('/', (req, res) => {
  // Set a timeout of 10 seconds
  setTimeout(() => {
    res.status(500).send('Request timed out');
  }, 10000);


  res.send('Hello from Node.js backend!');
});

app.listen(3005, () => {
  console.log('Server listening on port 3005');
});
