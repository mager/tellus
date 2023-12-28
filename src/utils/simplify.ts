import axios from "axios";
const shp = require("shpjs");
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

  const simplified = simplify(data, 0.01);
  const withValidPolygons = removeInvalidPolygons(simplified);
  return removeInvalidMultiPolygons(withValidPolygons);
};

const removeInvalidMultiPolygons = (data: any) => {
  data.features.filter((feature: any) => {
    if (feature.geometry.type !== "MultiPolygon") {
      return true; // Keep features that are not MultiPolygons
    }

    // Filter invalid polygons within the MultiPolygon
    feature.geometry.coordinates = feature.geometry.coordinates.filter(
      (polygon: any) => {
        return polygon.every((ring: any) => ring.length >= 4); // Ensure all rings have at least 4 points
      }
    );

    // Remove the entire feature if it has no valid polygons left
    return feature.geometry.coordinates.length > 0;
  });
  return data;
};

const removeInvalidPolygons = (data: any) => {
  data.features.filter((feature: any) => {
    if (feature.geometry.type !== "Polygon") {
      return true; // Keep features that are not Polygons
    }

    // Filter invalid polygons within the MultiPolygon
    feature.geometry.coordinates = feature.geometry.coordinates.filter(
      (ring: any) => {
        return ring.length >= 4; // Ensure all rings have at least 4 points
      }
    );

    // Remove the entire feature if it has no valid polygons left
    return feature.geometry.coordinates.length > 0;
  });
  return data;
};
