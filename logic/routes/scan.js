const express = require("express");
const router = express.Router();
const { getJson } = require("serpapi");
const Query = require("../models/query");
const Scan = require("../models/scan");

const ValidateObjectId = require("../middleware/validateObjectId");

const searchSerpApi = (params) => {
  return new Promise((resolve, reject) => {
    try {
      getJson(params, (json) => {
        if (json.error) reject(json.error);
        else resolve(json);
      });
    } catch (err) {
      reject(err);
    }
  });
};

router.get("/", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: "q is required" });

    let queryDoc = await Query.findOne({ query: q });
    if (!queryDoc) {
      queryDoc = await Query.create({
        query: q,
        engine: "google",
        location: "",
      });
    }

    const allResults = [];
    let params = {
      engine: queryDoc.engine || "google",
      api_key: process.env.SERPAPI_KEY,
      q: queryDoc.query,
      location: queryDoc.location || "United States",
    };

    let pageCount = 0;
    const MAX_PAGES = 5;

    while (params && pageCount < MAX_PAGES) {
      const json = await getJson(params);

      if (json.organic_results) {
        allResults.push(
          ...json.organic_results.map((r) => ({
            title: r.title,
            link: r.link,
            snippet: r.snippet,
          })),
        );
      }

      if (json.serpapi_pagination && json.serpapi_pagination.next) {
        const nextUrl = new URL(json.serpapi_pagination.next);
        params = Object.fromEntries(nextUrl.searchParams);
        params.api_key = process.env.SERPAPI_KEY;
        pageCount++;
      } else {
        params = null;
      }
    }

    const scan = await Scan.create({
      query: queryDoc._id,
      results: allResults,
    });

    res.json(scan);
  } catch (error) {
    console.error("Scan Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  }
});

router.get("/results", async (req, res) => {
  try {
    const quriesResults = await Scan.find().sort({ createdAt: -1 });

    if (quriesResults.length === 0) {
      return res.status(404).json({ message: "No scan stored" });
    }

    res.status(200).json({
      message: "Retrieved successfully",
      data: quriesResults,
      success: true,
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/:id", ValidateObjectId, async (req, res) => {
  try {
    const { id } = req.params;

    const quriesResult = await Scan.findById(id);

    if (!quriesResult) {
      return res.status(404).json({ message: "No scans stored" });
    }

    res.status(200).json({
      message: "Retrieved successfully",
      data: quriesResult,
      success: true,
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.delete("/:id", ValidateObjectId, async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Scan.findByIdAndDelete(id);

    if (!data) {
      return res.status(400).json({ message: "Not found" });
    }

    res.status(200).json({
      message: "Deleted successfully",
      data: data,
      sucess: true,
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
