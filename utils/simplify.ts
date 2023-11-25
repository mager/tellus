import axios from "axios";
import shp from "shpjs";
const simplify = require("simplify-geojson");

export const simplifyGeojsonFromURL = async (url: string) => {
  if (!url.endsWith(".zip")) {
    throw new Error("URL must end in .zip");
  }

  const response = await axios.get(url, { responseType: "arraybuffer" });
  const data = await shp(response.data);
  return simplify(data, 0.01);
};
