import express from "express";
import type { Request, Response } from "express";
import { simplifyShapefileV2 } from "../utils/simplify";
import { errorResponse, successResponse } from "../utils/http";

const router = express.Router();

router.post("/geojson", async (req: Request, res: Response) => {
  const { url } = req.body;

  if (!url) {
    return errorResponse(res, 400, "url");
  }

  try {
    const simplifiedGeometry = await simplifyShapefileV2(url);
    return successResponse(res, simplifiedGeometry);
  } catch (error) {
    return errorResponse(res, 500, "Error simplifying shapefile");
  }
});

module.exports = router;
