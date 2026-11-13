const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    reporterId: { type: String, required: true }, // Firebase Auth UID
    itemId: { type: String, required: true },
    itemName: { type: String, default: "" },
    claimedBy: { type: String, default: "" }, // email of claimant
    message: { type: String, default: "" },
    timestamp: { type: Number, default: () => Date.now() },
    read: { type: Boolean, default: false },
  },
  {
    collection: "notifications",
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
