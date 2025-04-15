const express = require("express");
const router = express.Router();
const Image = require("../models/Image");
const protect = require("../middleware/authMiddleware");

// POST /api/image/save
router.post("/save", protect, async (req, res) => {
  try {
    const { imageId, rects } = req.body;

    if (!imageId || !Array.isArray(rects)) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const image = new Image({
      imageId,
      user: req.user._id,
      rects,
    });

    await image.save();
    res.status(201).json({ message: "Boundaries saved", image });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/all", protect, async (req, res) => {
  try {
    const images = await Image.find({ user: req.user._id });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
