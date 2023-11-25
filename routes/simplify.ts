const express = require("express");
import { simplifyGeojsonFromURL } from "../utils/simplify";
const { errorResponse, successResponse } = require("../utils/http");

const router = express.Router();

router.put("/geojson", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return errorResponse(res, 400, "url");
  }

  try {
    const simplifiedGeometry = await simplifyGeojsonFromURL(url);
    return successResponse(res, simplifiedGeometry);
  } catch (error) {
    console.error("Error simplifying shapefile:", error);
    return errorResponse(res, 500, "Error simplifying shapefile");
  }
});

module.exports = router;
