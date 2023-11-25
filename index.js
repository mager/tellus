const express = require('express');
const axios = require('axios');
const { exec } = require('child_process');
const shp = require('shpjs');
const simplify = require('simplify-geojson');

const { errorResponse, successResponse } = require('./util')

// Setup Express app
const app = express();

// Ensure that Express can parse JSON
app.use(express.json())

// Setup API routes
const apiRoutes = express.Router();
app.use('/api', apiRoutes);

apiRoutes.put('/simplify/geojson', async (req, res) => {
  if (!req.body.url) {
    return errorResponse(res, 400, 'url');
  }

  const url = req.body.url;
  console.log(`Simplifying geometry for ${url}`);

  // If the URL doesn't end in .zip, return an error
  if (!url.endsWith('.zip')) {
    return errorResponse(res, 400, 'url must end in .zip');
  }

  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const data = await shp(response.data);
    return successResponse('success', simplify(data, 0.01));
  } catch (error) {
    console.error('Error getting shapefile:', error);
    return errorResponse(res, 500, 'Error getting shapefile');
  }

});

app.listen(3005, () => {
  console.log('Server listening on port 3005');
});
