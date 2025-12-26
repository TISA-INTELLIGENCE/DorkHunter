require("dotenv").config();
const express = require("express");
const cors = require("cors");
const ConnectDB = require("./config/DB");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 4000;

ConnectDB();

app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    message:
      "DorkHunter is an advanced OSINT tool designed to simplify Google dorking and web reconnaissance. It helps users perform precise searches by removing ambiguity from Google results, providing structured and clear data outputs. Built with the MERN stack (MongoDB, Express, React, Node.js), this project streamlines the process for OSINT enthusiasts, security researchers, and investigators.",
    sucess: true,
  });
});

const scan = require("./routes/scan");
app.use("/api/v1", scan);
app.get("/api/healthy", (req, res) => {
  res.status(200).json({
    message: "All good",
    sucess: true,
    timesatamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use((req, res, next) => {
  res.status(404).json({
    message: `Url not found: ${req.url}`,
    sucess: false,
  });

  next();
});

app.listen(PORT, () => {
  console.log(`Listening at: http://localhost:${PORT}`);
});
