const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// GET /api/notifications?reporterId=<uid> — fetch unread notifications for a user
router.get("/", async (req, res) => {
  try {
    const { reporterId } = req.query;
    if (!reporterId) return res.status(400).json({ error: "reporterId query param required" });

    const notifications = await Notification.find({ reporterId, read: false }).lean();
    const mapped = notifications.map(({ _id, __v, ...rest }) => ({
      id: _id.toString(),
      ...rest,
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/notifications — create a notification
router.post("/", async (req, res) => {
  try {
    const notif = new Notification(req.body);
    const saved = await notif.save();
    const { _id, __v, ...rest } = saved.toObject();
    res.status(201).json({ id: _id.toString(), ...rest });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/notifications/:id — mark notification as read
router.patch("/:id", async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, lean: true }
    );
    if (!updated) return res.status(404).json({ error: "Notification not found" });
    const { _id, __v, ...rest } = updated;
    res.json({ id: _id.toString(), ...rest });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
