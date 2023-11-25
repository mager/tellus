const axios = require("axios");
const shp = require("shpjs");
const simplify = require("simplify-geojson");

export const simplifyGeojsonFromURL = async (url) => {
  if (!url.endsWith(".zip")) {
    throw new Error("URL must end in .zip");
  }

  const response = await axios.get(url, { responseType: "arraybuffer" });
  const data = await shp(response.data);
  return simplify(data, 0.01);
};
