import axios from "axios";
const shp = require("shpjs");
// import turf from "@turf/turf";
import type { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";

const simplify = require("simplify-geojson");

export const simplifyShapefile = async (
  url: string
): Promise<FeatureCollection<Geometry, GeoJsonProperties>[]> => {
  if (!url.endsWith(".zip")) {
    throw new Error("URL must end in .zip");
  }

  const response = await axios.get(url, { responseType: "arraybuffer" });
  const data = await shp(response.data);

  return simplify(data, 0.01);
};

export const simplifyShapefileV2 = async (url: string) => {
  if (!url.endsWith(".zip")) {
    throw new Error("URL must end in .zip");
  }

  console.log(`Simplifying shapefile! URL: ${url}`);

  const response = await axios.get(url, { responseType: "arraybuffer" });
  const data = (await shp(response.data)) as FeatureCollection<
    Geometry,
    GeoJsonProperties
  >[];

  return simplify(data, 0.01);
};
