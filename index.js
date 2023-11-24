const express = require('express');
const axios = require('axios');
const { exec } = require('child_process');
const shp = require('shpjs');
const simplify = require('simplify-geojson')

// Setup Express app
const app = express();

// Ensure that Express can parse JSON
app.use(express.json())

// Setup API routes
const apiRoutes = express.Router();
app.use('/api', apiRoutes);

apiRoutes.put('/simplifyGeometry', async (req, res) => {
  if (!req.body.url) {
    return res.status(400).send({
      "status": "error",
      "message": "Missing required property: url"
    });
  }

  const url = req.body.url;
  console.log(`Simplifying geometry for ${url}`);

  // If the URL doesn't end in .zip, return an error
  if (!url.endsWith('.zip')) {
    return res.status(400).send({
      "status": "error",
      "message": "URL must end in .zip"
    });
  }

  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const data = await shp(response.data);
    return res.status(200).send({
      "status": "success",
      "data": simplify(data, 0.01)
    });
  } catch (error) {
    console.error('Error getting shapefile:', error);
    return res.status(500).send({
      "status": "error",
      "message": "Error getting shapefile"
    });
  }

});

app.listen(3005, () => {
  console.log('Server listening on port 3005');
});
