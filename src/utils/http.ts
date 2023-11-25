import type { Response } from "express";
import type { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";

export const errorResponse = (res: Response, code: number, message: string) => {
  return res.status(code).send({
    status: "error",
    message: message,
  });
};

// TODO: Fix any type
export const successResponse = (
  res: Response,
  data: Promise<FeatureCollection<Geometry, GeoJsonProperties>[]>
) => {
  return res.status(200).send({
    status: "success",
    data: data,
  });
};
