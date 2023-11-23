const express = require('express');
const app = express();
app.use(express.json())

app.get('/', (req, res) => {
  // Set a timeout of 10 seconds
  setTimeout(() => {
    res.status(500).send('Request timed out');
  }, 10000);


  res.send('Hello from Node.js backend!');
});

// I want to create a route group for all routes that start with /api
const apiRoutes = express.Router();
app.use('/api', apiRoutes);

// PUT /api/simplifyGeometry
apiRoutes.put('/simplifyGeometry', (req, res) => {
  // If the request body doesn't have a "url" property, return an error
  if (!req.body.url) {
    return res.status(400).send({
      "status": "error",
      "message": "Missing required property: url"
    });
  }

  const url = req.body.url;
  console.log(`Simplifying geometry for ${url}`);

  res.send({
    "status": "success",
  });
});

app.listen(3005, () => {
  console.log('Server listening on port 3005');
});
