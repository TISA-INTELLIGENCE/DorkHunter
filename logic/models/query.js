const mongoose = require("mongoose");
const QuerySchema = new mongoose.Schema(
  {
    query: {
      type: String,
      required: true,
      index: true,
    },

    engine: {
      type: String,
      default: "google",
    },

    location: String,
  },
  {
    timestamps: true,
  },
);

const Query = mongoose.model("Query", QuerySchema);
module.exports = Query;
