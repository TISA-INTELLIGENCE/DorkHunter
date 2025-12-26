const mongoose = require("mongoose");

const ScanSchema = new mongoose.Schema(
  {
    query: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Query",
      required: true,
    },

    results: [
      {
        title: String,
        link: String,
        snippet: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scan", ScanSchema);
