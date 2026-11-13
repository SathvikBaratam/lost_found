const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    location: { type: String, default: "" },
    status: {
      type: String,
      enum: ["lost", "found", "resolved"],
      default: "lost",
    },
    category: { type: String, default: "other" },
    imageUrl: { type: String, default: null },
    reporterId: { type: String, required: true }, // Firebase Auth UID
    reporterName: { type: String, default: "" },
    date: { type: Number, default: () => Date.now() },
  },
  {
    // Store in the 'lost_item' collection as requested
    collection: "lost_item",
  }
);

module.exports = mongoose.model("Item", itemSchema);
