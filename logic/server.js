const express = require("express");
require("dotenv").config();
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;
const SEARCH_KEY = process.env.SEARCH_ENV;
const SEARCH_ENGINE_ID = process.env.SEARCH_ENGINE_ID;

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello Njox!" });
});

app.get("/dork", async (req, res) => {
  try {
    const query = req.query.q; // <-- get ?q= from URL

    if (!query) {
      return res.status(400).json({ error: "Missing search query ?q=" });
    }

    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${SEARCH_KEY}&cx=${SEARCH_ENGINE_ID}&q=${query}`
    );

    const data = await response.json();
    console.log(data);

    return res.json({
      success: true,
      results: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Listening at: http://localhost:${PORT}`);
});
