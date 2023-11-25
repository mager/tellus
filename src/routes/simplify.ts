import express from "express";
import type { Request, Response } from "express";
import { simplifyGeojsonFromURL } from "../utils/simplify";
import { errorResponse, successResponse } from "../utils/http";

const router = express.Router();

router.put("/geojson", async (req: Request, res: Response) => {
  const { url } = req.body;

  if (!url) {
    return errorResponse(res, 400, "url");
  }

  try {
    const simplifiedGeometry = await simplifyGeojsonFromURL(url);
    return successResponse(res, simplifiedGeometry);
  } catch (error) {
    return errorResponse(res, 500, "Error simplifying shapefile");
  }
});

module.exports = router;
