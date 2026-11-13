const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// GET /api/items — fetch all items
router.get("/", async (_req, res) => {
  try {
    const items = await Item.find().lean();
    // Map MongoDB _id to id for frontend compatibility
    const mapped = items.map(({ _id, __v, ...rest }) => ({ id: _id.toString(), ...rest }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/items — create a new item
router.post("/", async (req, res) => {
  try {
    const item = new Item(req.body);
    const saved = await item.save();
    const { _id, __v, ...rest } = saved.toObject();
    res.status(201).json({ id: _id.toString(), ...rest });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/items/:id — update an item (e.g. status change)
router.patch("/:id", async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, lean: true }
    );
    if (!updated) return res.status(404).json({ error: "Item not found" });
    const { _id, __v, ...rest } = updated;
    res.json({ id: _id.toString(), ...rest });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/items/:id — delete an item
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Item not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
