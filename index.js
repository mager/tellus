const express = require('express');
const app = express();

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

// GET /api/users
apiRoutes.get('/simplifyGeometry', (req, res) => {
  console.log('TODO: Simplify geometry');
  res.send({});
});

app.listen(3005, () => {
  console.log('Server listening on port 3005');
});
