const express = require('express');
const app = express();
app.use(express.json())

const apiRoutes = express.Router();
app.use('/api', apiRoutes);

apiRoutes.put('/simplifyGeometry', (req, res) => {
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
