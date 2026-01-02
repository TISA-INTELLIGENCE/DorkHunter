require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const ConnectDB = require("./config/DB");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use(
  cors({
    origin: ["http://localhost:5173"],
  }),
);

const PORT = process.env.PORT || 4000;

ConnectDB();

app.get("/", (req, res) => {
  res.status(200).json({
    message:
      "DorkHunter api is an advanced OSINT tool designed to simplify Google dorking and web reconnaissance.",
    success: true,
  });
});

const scanRouter = require("./routes/scan");
const queriesRouter = require("./routes/queries");

app.use("/api/v1/scans", scanRouter);
app.use("/api/v1/queries", queriesRouter);

app.get("/api/healthy", (req, res) => {
  res.status(200).json({
    message: "All good",
    success: true,
    timesatamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use((req, res, next) => {
  res.status(404).json({
    message: `Url not found: ${req.url}`,
    success: false,
  });

  next();
});

app.listen(PORT, () => {
  console.log(`Listening at: http://localhost:${PORT}`);
});

/*
npx eslint --init

*/
