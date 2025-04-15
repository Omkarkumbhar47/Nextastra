const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  imageId: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rects: [
    {
      x: Number,
      y: Number,
      width: Number,
      height: Number,
      stroke: String,
    },
  ],
});

module.exports = mongoose.model("Image", imageSchema);
