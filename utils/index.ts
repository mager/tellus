
// Function to simplify geometry and generate GeoJSON
const mapshaper = async (shapefilePath, outputGeoJSONPath) => {
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
    const zipStream = response.data;
    const tempDir = os.tmpdir() + '/data-' + Date.now();
    fs.mkdirSync(tempDir);
    console.log(`Created temp dir ${tempDir}`);
    let shapeFilename = '';

    const validShapefileFilenames = ['cpg', 'dbf', 'prj', 'shp', 'shx']

    zipStream
        .pipe(unzipper.Parse())
        .on('entry', function (entry) {
            const fileName = entry.path;
            console.log(`Unzipping ${fileName}`);


            const fileExtension = fileName.split('.').pop();
            if (validShapefileFilenames.includes(fileExtension)) {
                console.log(`Found valid shapefile file ${fileName}`);
                entry.pipe(fs.createWriteStream(`${tempDir}/${fileName}`));
                console.log(`Wrote ${fileName} to ${tempDir}`);
                if (fileExtension === 'shp') {
                    shapeFilename = fileName;
                    console.log({ shapeFilename });
                }
            } else {
                console.log(`Skipping ${fileName}`);
            }

            entry.autodrain();

        })
        .on('error', (error) => {
            console.error('Error unzipping file:', error);
        })
        .on('finish', () => {
            console.log('Zip file successfully unzipped');

            console.log("Let's simplify geometry!")
            const shapefilePath = `${tempDir}/${shapeFilename}`;
            const outputGeoJSONPath = `${tempDir}/output.geojson`;
            mapshaper(shapefilePath, outputGeoJSONPath);
        });
}
