const express = require("express");
const router = express.Router();
const { getJson } = require("serpapi");
const Query = require("../models/query");
const mongoose = require("mongoose");
const Scan = require("../models/scan");

// send request to get queries
router.get("/", async (req, res) => {
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

// reads from scans
router.get("/results", async (req, res) => {
  try {
    const quriesResults = await Scan.find().sort({ createdAt: -1 });

    console.log(req.path);

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
      message: "INternal server error",
    });
  }
});

// read one
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "Enter keyword" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid id",
      });
    }
    const quriesResult = await Scan.findById(id);

    console.log(quriesResult);

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
      message: "INternal server error",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "id not found",
      });
    }

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
      message: "INternal server error",
    });
  }
});

module.exports = router;
