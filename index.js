const express = require('express');
const os = require('os');
const fs = require('fs');
const axios = require('axios');
const unzipper = require('unzipper');
const { exec } = require('child_process');
const shp = require('shpjs');
const mapshaper = require('mapshaper');
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
    const simplifiedData = simplify(data, 0.01);
    return res.status(200).send({
      "status": "success",
      "data": simplifiedData
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

// Function to simplify geometry and generate GeoJSON
const simplifyGeometry = async (shapefilePath, outputGeoJSONPath) => {
  const command = `mapshaper -i ${shapefilePath} -o ${outputGeoJSONPath} --dissolve --simplify 50%`;
  await exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Error simplifying geometry:', error);
    } else {
      console.log('Geometry simplified successfully!!');
    }
  });
};

const handleZipFile = async (zipFilePath, tempDir) => {

  // const zipStream = response.data;
  // const tempDir = os.tmpdir() + '/data-' + Date.now();
  // fs.mkdirSync(tempDir);
  // console.log(`Created temp dir ${tempDir}`);
  // let shapeFilename = '';

  // const validShapefileFilenames = ['cpg', 'dbf', 'prj', 'shp', 'shx']

  // zipStream
  //   .pipe(unzipper.Parse())
  //   .on('entry', function (entry) {
  //     const fileName = entry.path;
  //     console.log(`Unzipping ${fileName}`);


  //     const fileExtension = fileName.split('.').pop();
  //     if (validShapefileFilenames.includes(fileExtension)) {
  //       console.log(`Found valid shapefile file ${fileName}`);
  //       entry.pipe(fs.createWriteStream(`${tempDir}/${fileName}`));
  //       console.log(`Wrote ${fileName} to ${tempDir}`);
  //       if (fileExtension === 'shp') {
  //         shapeFilename = fileName;
  //         console.log({ shapeFilename });
  //       }
  //     } else {
  //       console.log(`Skipping ${fileName}`);
  //     }

  //     entry.autodrain();

  //   })
  //   .on('error', (error) => {
  //     console.error('Error unzipping file:', error);
  //   })
  //   .on('finish', () => {
  //     console.log('Zip file successfully unzipped');

  //     console.log("Let's simplify geometry!")
  //     const shapefilePath = `${tempDir}/${shapeFilename}`;
  //     const outputGeoJSONPath = `${tempDir}/output.geojson`;
  //     simplifyGeometry(shapefilePath, outputGeoJSONPath);
  //   });

} 