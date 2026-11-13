const mongoose = require("mongoose");

const FindingSchema = new mongoose.Schema({
  title: String,
  link: String,
  snippet: String,
  dork: String,
  category: String,
  categoryLabel: String,
  severity: {
    type: String,
    enum: ["critical", "high", "medium", "low", "info"],
    default: "info",
  },
  score: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["new", "reviewing", "reported", "false-positive"],
    default: "new",
  },
  tags: [String],
});

const CampaignSchema = new mongoose.Schema(
  {
    domain: { type: String, required: true, index: true },
    categories: [String],
    stats: {
      dorksRun: { type: Number, default: 0 },
      totalFindings: { type: Number, default: 0 },
      bySeverity: {
        critical: { type: Number, default: 0 },
        high: { type: Number, default: 0 },
        medium: { type: Number, default: 0 },
        low: { type: Number, default: 0 },
        info: { type: Number, default: 0 },
      },
    },
    runErrors: [String],
    findings: [FindingSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Campaign", CampaignSchema);
