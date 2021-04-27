const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, "itemName is required."],
  },
  position: {
    type: Array,
    required: [true, "position is required"],
  },
  direction: {
    type: Array,
    default: [0, 0, 0],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Item", itemSchema);
