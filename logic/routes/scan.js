const express = require("express");
const router = express.Router();
const { getJson } = require("serpapi");
const Query = require("../models/query");
const Scan = require("../models/scan");

router.get("/scan", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: "q is required" });

    // 1. find or create query
    let queryDoc = await Query.findOne({ query: q });

    if (!queryDoc) {
      queryDoc = await Query.create({ query: q });
    }

    // 2. scan
    getJson(
      {
        engine: queryDoc.engine,
        api_key: process.env.SERPAPI_KEY,
        q: queryDoc.query,
        location: queryDoc.location,
      },
      async (json) => {
        const scan = await Scan.create({
          query: queryDoc._id,
          results: (json.organic_results || []).map((r) => ({
            title: r.title,
            link: r.link,
            snippet: r.snippet,
          })),
        });

        res.json(scan);
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
