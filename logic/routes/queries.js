const express = require("express");
const router = express.Router();

const Query = require("../models/query");

router.get("/", async (req, res) => {
  try {
    const quriesResults = await Query.find().sort({ createdAt: -1 });

    if (quriesResults.length === 0) {
      return res.status(404).json({ message: "No queries stored" });
    }

    res.status(200).json({
      message: "Retrieved successfully",
      data: quriesResults,
      success: true,
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.get("/:query", async (req, res) => {
  try {
    const { query } = req.params;

    if (!query) {
      return res.status(400).json({
        message: "Enter query",
        success: false,
      });
    }

    const queryResult = await Query.findOne({ query });

    if (!queryResult) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json({
      message: "Retrieved successfully",
      data: queryResult,
      success: true,
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:query", async (req, res) => {
  try {
    const { query } = req.params;

    if (!query) {
      return res.status(400).json({ message: "Query not found" });
    }

    const deletedQuery = await Query.deleteOne({ query: query });

    if (!deletedQuery) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json({
      message: "Deleted successfully",
      success: true,
      data: deletedQuery,
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
